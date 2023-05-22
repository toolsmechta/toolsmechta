cmake_minimum_required(VERSION 3.0)

project(shell-fetch_counter LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(CURL REQUIRED)
find_package(OpenMP REQUIRED)

set(CMAKE_CXX_FLAGS ${CMAKE_CXX_FLAGS} "-fopenmp")

include_directories(${CURL_INCLUDE_DIRS})
add_executable(shell-fetch_counter shell-fetch_counter.cpp)

target_link_libraries(shell-fetch_counter ${CURL_LIBRARIES})
