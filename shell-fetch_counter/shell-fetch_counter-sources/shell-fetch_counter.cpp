/*MIT License*/

#include <cstdint>
#include <cstring>
#include <ctime>
#include <fstream>
#include <iostream>
#include <omp.h>
#include <string>
#include <string_view>

#define CURL_USE 1

#if CURL_USE
// use CURL
#include <curl/curl.h>
constexpr char *internal_url_start = "https://profile-counter.glitch.me/toolsmechta.kz";
constexpr char *internal_url_end = "/count.svg";
#endif
constexpr int max_tp = 4;
constexpr char types[max_tp][5] = {"\0OTH", "_kbt", "_mbt", "_gsm"};
constexpr auto fetch_filename = "fetch";
constexpr auto fetch_extension = ".db";

struct url_data
{
    size_t size;
    char *data;
};

int parse_svg(const std::string_view &svgBuffer);
int fetch_num(const std::string &url);
bool load(int tp_nums[4]);
void save(int tp_nums[4]);

std::fstream f;

std::string get_fetch_url(int type)
{
    return std::string(internal_url_start) + types[type] + internal_url_end;
}

std::string get_fetch_filename(int type)
{
    return std::string(fetch_filename) + std::string(types[type]) + fetch_extension;
}

int main(int argc, char *argv[])
{
    int nums[max_tp];
    std::cout << "Fetching ..." << std::endl;

    if(!load(nums))
    {
        std::cerr << "failed" << std::endl;
        return 1;
    }
    std::cout << "mechta-coshka runned once: " << std::endl;

    for(int x = 0; x < max_tp; ++x)
    {
        std::cout << "\t" << (types[x] + 1) << " = " << nums[x] << " (count)" << std::endl;
    }
    return 0;
}

bool load(int tp_nums[4])
{
    using namespace std;
    int tp_nums_save[4];

    std::cout << "Runned thread(s) " << max_tp << std::endl;

#pragma omp parallel for
    for(size_t tp = 0; tp < max_tp; ++tp)
    {

        std::fstream f;
        int num;
        int prevNum = 0;

        f.open(get_fetch_filename(tp), std::ios_base::in);

        if(f.is_open())
        {
            char buf[64];
            uint32_t y, len;
            len = f.seekg(0, ios_base::end).tellg();
            f.seekg(len - std::min(static_cast<uint32_t>(sizeof buf), len), ios_base::beg);
            y = f.readsome(buf, sizeof buf) - 1;

            for(int i = y; i > 0; --i)
            {
                if(buf[i] == '|')
                {
                    prevNum = std::atoi(buf + 1 + i);
                    break;
                }
            }
            f.close();
        }

        num = fetch_num(get_fetch_url(tp));

        if((tp_nums[tp] = tp_nums_save[tp] = num) != -1)
            tp_nums[tp] = std::abs(prevNum - num - /*Pop 1 elem for current session*/ 1);
    }
    // save
    save(tp_nums_save);
    return true;
}

void save(int tp_nums[4])
{
    char buffer[1024];
    for(int i = 0; i < max_tp; ++i)
    {
        if(tp_nums[i] == -1)
        {
            std::cerr << types[i] + 1 << " failed" << std::endl;
            continue;
        }
        f.open(get_fetch_filename(i), std::ios_base::app);

        if(!f.is_open())
        {
            std::cerr << "Failed a open file" << std::endl;
            continue;
        }

        time_t tm = std::time(nullptr);
        std::strftime(buffer + 512, 512, "%H:%M:%S %d.%m.%Y", std::localtime(&tm));
        int x = sprintf(buffer, "%s|%u|%d\n", buffer + 512, tm, tp_nums[i]);
        f.write(buffer, x);
        f.close();
    }
}

int parse_svg(const std::string_view &svgBuffer)
{
    using namespace std;
    static auto const pattern = "tspan";
    static auto const pstart = "<";
    static auto const pend = ">";
    string numbuffer;

    string_view::size_type pos = 0;
    while(pos < svgBuffer.length())
    {
        pos = svgBuffer.find(pattern, pos);
        if(pos == string_view::npos)
        {
            break;
        }

        pos = svgBuffer.find(pend, pos);
        if(pos == string_view::npos)
        {
            break;
        }

        // get num
        numbuffer += svgBuffer[++pos];

        pos = svgBuffer.find(pstart, pos);
        if(pos == string_view::npos)
        {
            break;
        }
        pos += strlen(pattern);
    }

    return std::atoi(numbuffer.c_str());
}

size_t write_data(void *ptr, size_t size, size_t nmemb, struct url_data *data)
{
    size_t index = data->size;
    size_t n = (size * nmemb);
    char *tmp;

    data->size += (size * nmemb);

    tmp = (char *) realloc(data->data, data->size + 1); /* +1 for '\0' */

    if(tmp)
    {
        data->data = tmp;
    }
    else
    {
        if(data->data)
        {
            free(data->data);
        }
        fprintf(stderr, "Failed to allocate memory.\n");
        return 0;
    }

    memcpy(((char *) data->data + index), ptr, n);
    data->data[data->size] = '\0';

    return size * nmemb;
}

int fetch_num(const std::string &url)
{

#if CURL_USE
    CURLcode res;
    CURL *curl;
    url_data data {};

    curl = curl_easy_init();
    curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &data);
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_data);

    res = curl_easy_perform(curl);
    curl_easy_cleanup(curl);
    if(res != CURLE_OK)
    {
        // fprintf(stderr, "curl_easy_perform() failed: %s\n",
        // curl_easy_strerror(res));
        return -1;
    }


    int num = parse_svg(data.data);
    std::free(data.data);

#else
    // use local
    int num = parseFromSvg("<?xml version=\"1.0\" encoding=\"UTF-8\"?><svg width=\"224px\" "
                           "height=\"30px\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" "
                           "xmlns:xlink=\"http://www.w3.org/1999/xlink\">    <title>Count</title>   "
                           " <g id=\"Page-1\" "
                           "stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> "
                           "                                                                     "
                           "<rect id=\"Rectangle\" fill=\"#000000\" x=\"0\" y=\"0.5\" width=\"29\" "
                           "height=\"29\"/>        <text id=\"0\" font-family=\"Courier\" "
                           "font-size=\"24\" font-weight=\"normal\" fill=\"#00FF13\">            "
                           "<tspan x=\"7\" y=\"22\">0</tspan>        </text>        <rect "
                           "id=\"Rectangle\" fill=\"#000000\" "
                           "x=\"32\" y=\"0.5\" width=\"29\" height=\"29\"/>        <text id=\"0\" "
                           "font-family=\"Courier\" font-size=\"24\" font-weight=\"normal\" "
                           "fill=\"#00FF13\">            <tspan x=\"39\" y=\"22\">0</tspan>        "
                           "</text>        <rect "
                           "id=\"Rectangle\" fill=\"#000000\" x=\"64\" y=\"0.5\" width=\"29\" "
                           "height=\"29\"/>        <text id=\"0\" font-family=\"Courier\" "
                           "font-size=\"24\" font-weight=\"normal\" fill=\"#00FF13\">            "
                           "<tspan x=\"71\" "
                           "y=\"22\">0</tspan>        </text>        <rect id=\"Rectangle\" "
                           "fill=\"#000000\" x=\"96\" y=\"0.5\" width=\"29\" height=\"29\"/>        "
                           "<text id=\"0\" font-family=\"Courier\" font-size=\"24\" "
                           "font-weight=\"normal\" "
                           "fill=\"#00FF13\">            <tspan x=\"103\" y=\"22\">0</tspan>        "
                           "</text>        <rect id=\"Rectangle\" fill=\"#000000\" x=\"128\" "
                           "y=\"0.5\" width=\"29\" height=\"29\"/>        <text id=\"0\" "
                           "font-family=\"Courier\" "
                           "font-size=\"24\" font-weight=\"normal\" fill=\"#00FF13\">            "
                           "<tspan x=\"135\" y=\"22\">0</tspan>        </text>        <rect "
                           "id=\"Rectangle\" fill=\"#000000\" x=\"160\" y=\"0.5\" width=\"29\" "
                           "height=\"29\"/>        "
                           "<text id=\"0\" font-family=\"Courier\" font-size=\"24\" "
                           "font-weight=\"normal\" fill=\"#00FF13\">            <tspan x=\"167\" "
                           "y=\"22\">0</tspan>        </text>        <rect id=\"Rectangle\" "
                           "fill=\"#000000\" x=\"192\" y=\"0.5\" "
                           "width=\"29\" height=\"29\"/>        <text id=\"0\" "
                           "font-family=\"Courier\" font-size=\"24\" font-weight=\"normal\" "
                           "fill=\"#00FF13\">            <tspan x=\"199\" y=\"22\">1</tspan>        "
                           "</text>    </g></svg>");
#endif
    return num;
}
