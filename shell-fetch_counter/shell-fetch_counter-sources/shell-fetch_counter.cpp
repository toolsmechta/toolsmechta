/*MIT License*/

#include <cstdlib>
#include <fstream>
#include <iostream>
#include <string>
#include <string_view>
#include <ctime>
#include <cstring>

#define CURL_USE 1

#if CURL_USE
// use CURL
#include <curl/curl.h>
constexpr char* internal_url = { "https://profile-counter.glitch.me/toolsmechta.kz/count.svg" };
#endif

constexpr auto fetch_filename = "fetch.db";

struct url_data {
    size_t size;
    char* data;
};

int parseFromSvg(const std::string_view& svgBuffer);
int curlGetNum();
int load();
int save(int n);

std::fstream f;

int main(int argc, char* argv[])
{
    int n;
    std::cout << "Toolsmechta runned once: " << (n = load()) << " (count)" << std::endl;
    return 0;
}

int load()
{
    using namespace std;
    int num;
    int prevNum = 0;

    f.open(fetch_filename, std::ios_base::in);

    if (f.is_open()) {
        char buf[64];
        uint32_t y, len;
        len = f.seekg(0, ios_base::end).tellg();
        f.seekg(len - std::min(static_cast<uint32_t>(sizeof buf), len), ios_base::beg);
        y = f.readsome(buf, sizeof buf) - 1;

        for (int i = y; i > 0; --i) {
            if (buf[i] == '|') {
                prevNum = std::atoi(buf + 1 + i);
                break;
            }
        }
        f.close();
    }

    num = curlGetNum();

    if (num != -1) {
        //save
        save(num);
        num = std::abs(prevNum - num) - /*Pop 1 elem for current session*/ 1 ;
    }

    return num;
}

int save(int n)
{
    f.open(fetch_filename, std::ios_base::app);

    if (!f.is_open()) {
        std::cerr << "Failed a open file \"" << fetch_filename << "\"" << std::endl;
        return -1;
    }
    if (!f) {
        std::cerr << "save failed" << std::endl;
        return -1;
    }

    char buffer[1024];
    time_t tm = std::time(nullptr);
    std::strftime(buffer + 512, 512, "%H:%M:%S %d.%M.%Y", std::localtime(&tm));
    int x = sprintf(buffer, "%s|%u|%d\n", buffer + 512, tm, n);
    f.write(buffer, x);
    f.close();
    return n;
}

int parseFromSvg(const std::string_view& svgBuffer)
{
    using namespace std;
    static auto const pattern = "tspan";
    static auto const pstart = "<";
    static auto const pend = ">";
    string numbuffer;

    string_view::size_type pos = 0;
    while (pos < svgBuffer.length()) {
        pos = svgBuffer.find(pattern, pos);
        if (pos == string_view::npos) {
            break;
        }

        pos = svgBuffer.find(pend, pos);
        if (pos == string_view::npos) {
            break;
        }

        // get num
        numbuffer += svgBuffer[++pos];

        pos = svgBuffer.find(pstart, pos);
        if (pos == string_view::npos) {
            break;
        }
        pos += strlen(pattern);
    }

    return std::atoi(numbuffer.c_str());
}

size_t write_data(void* ptr, size_t size, size_t nmemb, struct url_data* data)
{
    size_t index = data->size;
    size_t n = (size * nmemb);
    char* tmp;

    data->size += (size * nmemb);

    tmp = (char*)realloc(data->data, data->size + 1); /* +1 for '\0' */

    if (tmp) {
        data->data = tmp;
    } else {
        if (data->data) {
            free(data->data);
        }
        fprintf(stderr, "Failed to allocate memory.\n");
        return 0;
    }

    memcpy(((char*)data->data + index), ptr, n);
    data->data[data->size] = '\0';

    return size * nmemb;
}

int curlGetNum()
{

#if CURL_USE
    CURLcode res;
    CURL* curl;
    url_data data {};

    curl = curl_easy_init();
    curl_easy_setopt(curl, CURLOPT_URL, internal_url);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &data);
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_data);

    res = curl_easy_perform(curl);
    if (res != CURLE_OK) {
        fprintf(stderr, "curl_easy_perform() failed: %s\n", curl_easy_strerror(res));
    }

    curl_easy_cleanup(curl);

    int num = parseFromSvg(data.data);
    std::free(data.data);

#else
    // use local
    int num = parseFromSvg(
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?><svg width=\"224px\" height=\"30px\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">    <title>Count</title>    <g id=\"Page-1\" "
        "stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">                                                                      <rect id=\"Rectangle\" fill=\"#000000\" x=\"0\" y=\"0.5\" width=\"29\" "
        "height=\"29\"/>        <text id=\"0\" font-family=\"Courier\" font-size=\"24\" font-weight=\"normal\" fill=\"#00FF13\">            <tspan x=\"7\" y=\"22\">0</tspan>        </text>        <rect id=\"Rectangle\" fill=\"#000000\" "
        "x=\"32\" y=\"0.5\" width=\"29\" height=\"29\"/>        <text id=\"0\" font-family=\"Courier\" font-size=\"24\" font-weight=\"normal\" fill=\"#00FF13\">            <tspan x=\"39\" y=\"22\">0</tspan>        </text>        <rect "
        "id=\"Rectangle\" fill=\"#000000\" x=\"64\" y=\"0.5\" width=\"29\" height=\"29\"/>        <text id=\"0\" font-family=\"Courier\" font-size=\"24\" font-weight=\"normal\" fill=\"#00FF13\">            <tspan x=\"71\" "
        "y=\"22\">0</tspan>        </text>        <rect id=\"Rectangle\" fill=\"#000000\" x=\"96\" y=\"0.5\" width=\"29\" height=\"29\"/>        <text id=\"0\" font-family=\"Courier\" font-size=\"24\" font-weight=\"normal\" "
        "fill=\"#00FF13\">            <tspan x=\"103\" y=\"22\">0</tspan>        </text>        <rect id=\"Rectangle\" fill=\"#000000\" x=\"128\" y=\"0.5\" width=\"29\" height=\"29\"/>        <text id=\"0\" font-family=\"Courier\" "
        "font-size=\"24\" font-weight=\"normal\" fill=\"#00FF13\">            <tspan x=\"135\" y=\"22\">0</tspan>        </text>        <rect id=\"Rectangle\" fill=\"#000000\" x=\"160\" y=\"0.5\" width=\"29\" height=\"29\"/>        "
        "<text id=\"0\" font-family=\"Courier\" font-size=\"24\" font-weight=\"normal\" fill=\"#00FF13\">            <tspan x=\"167\" y=\"22\">0</tspan>        </text>        <rect id=\"Rectangle\" fill=\"#000000\" x=\"192\" y=\"0.5\" "
        "width=\"29\" height=\"29\"/>        <text id=\"0\" font-family=\"Courier\" font-size=\"24\" font-weight=\"normal\" fill=\"#00FF13\">            <tspan x=\"199\" y=\"22\">1</tspan>        </text>    </g></svg>");
#endif
    return num;
}
