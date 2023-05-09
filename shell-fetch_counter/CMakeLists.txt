cmake_minimum_required(VERSION 3.0)

project(SectorLine LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Boost)

if(Boost_FOUND)
    include_directories(${Boost_INCLUDE_DIRS})
    add_executable(shell-fetch_counter shell-fetch_counter.cpp)
    target_link_libraries(shell-fetch_counter ${Boost_LIBRARIES})
endif()


