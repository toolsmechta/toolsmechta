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

constexpr auto fetch_filename = "fetch";

struct url_data {
    size_t size;
    char* data;
};

struct dates {
    time_t time;
    int num;
};

int parseFromSvg(const std::string_view& svgBuffer);
int curlGetNum();
int load();
int save(int n);

std::fstream f;

int main(int argc, char* argv[])
{
    int n;
    std::cout << "total run num: " << (n = load()) << std::endl;
    if (n != -1) {
        save(n);
    }
    std::cout << "end" << std::endl;
}

int load()
{
    using namespace std;
    int num = -1;
    dates fileNum;

    f.open(fetch_filename, std::ios_base::in);

    if (f.is_open()) {
        char buf[1024];

        f.seekg(0, );
        auto readed = f.readsome(buf, sizeof buf);

    }
    f.close();

    num = curlGetNum();

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
    url_data data;

    curl = curl_easy_init();
    curl_easy_setopt(curl, CURLOPT_URL, internal_url);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &data);
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_data);

    res = curl_easy_perform(curl);
    if (res != CURLE_OK) {
        fprintf(stderr, "curl_easy_perform() failed: %s\n", curl_easy_strerror(res));
    }

    curl_easy_cleanup(curl);

    int num = parseFromSvg(data.data) - 1;
    std::free(data.data);

#else
    // use local
    int num = ncount("<?xml version=\"1.0\" encoding=\"UTF-8\"?><svg width=\"224px\" height=\"30px\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">    <title>Count</title>    <g id=\"Page-1\" "
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
