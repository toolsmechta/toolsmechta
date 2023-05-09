#include <boost/asio/connect.hpp>
#include <boost/asio/io_context.hpp>
#include <boost/asio/ip/tcp.hpp>
#include <boost/beast/core.hpp>
#include <boost/beast/core/tcp_stream.hpp>
#include <boost/beast/http.hpp>
#include <boost/beast/version.hpp>
#include <boost/url.hpp>
#include <cstdlib>
#include <fstream>
#include <iostream>
#include <string>

namespace beast = boost::beast; // from <boost/beast.hpp>
namespace http = beast::http; // from <boost/beast/http.hpp>
namespace net = boost::asio; // from <boost/asio.hpp>
using tcp = net::ip::tcp;

constexpr char* internal_url = { "https://profile-counter.glitch.me/toolsmechta.kz/count.svg" };

int main(int argc, char* argv[])
{
    std::cout << "run http-listener" << std::endl;

    boost::url_view u(internal_url);

    // The io_context is required for all I/O
    net::io_context ioc;

    // These objects perform our I/O
    tcp::resolver resolver(ioc);
    beast::tcp_stream stream(ioc);

    // Look up the domain name
    auto const results = resolver.resolve(internal_url, "41");
    http::request<http::string_body> req(http::verb::get, internal_url, 11);
    req.set(http::field::host, internal_url);
    req.set(http::field::user_agent, BOOST_BEAST_VERSION_STRING);

    http::write(stream, req);

    beast::flat_buffer buffer;
    http::response<http::dynamic_body> res;

    std::cout << "end";
}
