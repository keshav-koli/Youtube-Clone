let togglebutton = document.getElementById("togglebutton");
let sideBar = document.getElementById("sideBar");
let hide_items = document.getElementsByClassName("hide_items");
togglebutton.addEventListener("click", () => {
  for (items of hide_items) {
    console.log(items);
    // items.classList.add("demo");
    // items.classList.add("demo2");
    // items.classList.remove("demo");
    // items.classList.replace("demo2","ram");
    // console.log(items.classList.contains("ram"));
    // console.log(items.classList.contains("rama"));
    items.classList.toggle("hide_content");
    if (items.classList.contains("hide_content")) {
      sideBar.classList.add("show");
      sideBar.style.cssText = "width:3rem;height:100vh";
    } else {
      sideBar.classList.remove("show");
      sideBar.style.width = "10rem";
    }
  }
});
// classList ---> it allows to work with class names in an efficient manner
/*
    add() ---> It will add new class name
    remove() --> It will remove the class name
    replace() --> It will replace the class name with another name.
    contains() --> It will check the class name exists or not and returns a boolean value.
    toggle() --> It will check class nams is present or not.
                 If present  -- it will remove 
                 If not present  -- it will add

*/

// ! === API Integration ===
/*
    ? ==== API KEY ====
    >>> search google cloud
    >>> click on GCP link
    >>> click on console at top-right corner
    >>> permissons
    >>> add new project
    >>> choose the project you created
    >>> click on navigation menu
    >>> hover on api&services
    >>> click on library
    >>> move youtube category
    >>> click on youtube data api v3
    >>> click on enable
    >>> create credentials
    >>> choose the option PUBLIC DATA
    >>> now finally we received API KEY

    ? ==== Offcial Documentation ====
    >>> search for youtube data api
    >>> click on YouTube Data API | Google for Developers
    >>> click on references
    >>> read the documentation
    >>> move to search category

*/

//! ===== NOTES =====
//? SEARCH:
// A search result contains information about a YouTube video, channel, or playlist that matches the search parameters specified in an API request.
/* Expected output
{
  "kind": "youtube#searchResult",
  "etag": etag,
  "id": {
    "kind": string,
    "videoId": string,
    "channelId": string,
    "playlistId": string
  },
  "snippet": {
    "publishedAt": datetime,
    "channelId": string,
    "title": string,
    "description": string,
    "thumbnails": {
      (key): {
        "url": string,
        "width": unsigned integer,
        "height": unsigned integer
      }
    },
    "channelTitle": string,
    "liveBroadcastContent": string
  }
}
*/

// REFERENCE LINK: https://developers.google.com/youtube/v3/docs/search

const API_KEY = "AIzaSyC40f8_wSV1XpxKb-h8vNDh2hQ1bIlfq4c";
// const API_KEY = "AIzaSyChL3R4VdC639_f-9RPDCSvSYVVns-PRQA ";
const SEARCH_HTTP = "https://www.googleapis.com/youtube/v3/search?"; // remember ? symbol
const CHANNEL_HTTP = " https://www.googleapis.com/youtube/v3/channels?";
const VIDEO_DETAILS = "https://www.googleapis.com/youtube/v3/videos?";
let CallYoutubeDataAPI = async (query) => {
  let search_params = new URLSearchParams({
    key: API_KEY, // M
    part: "snippet", // M
    q: query, // M
    maxResults: 15,
    videoDuration: "medium",
    type: "video",
    regionCode: "IN",
    safeSearch: "strict",
  });

  let res = await fetch(SEARCH_HTTP + search_params);
  let data = await res.json();
  // console.log(data);

  //   console.log(data.items);

  //   console.log(data.items[0]);
  //   console.log(data.items[0].id);

  //   console.log(data.items[1]);
  //   console.log(data.items[2]);

  // We want thumbnail url,channelIcon,title,channelName,Video Link
  data.items.map((video_data, ind) => {
    // // console.log(video_data);
    // console.log("video id: "+video_data.id.videoId); // video Id
    // console.log("channel id:"+video_data.snippet.channelId);// channel Id
    // console.log(video_data.snippet.title);
    // console.log("channel---Title",video_data.snippet.thumbnails.high.url);//thumbnail

    //to get channel icon
    getChannelIcon(video_data);
    // getVideoDetails(video_data);
  });
};

let getChannelIcon = async (video_data) => {
  let channelParam = new URLSearchParams({
    key: API_KEY, //M
    part: "snippet", //M
    id: video_data.snippet.channelId,
  });
  let res = await fetch(CHANNEL_HTTP + channelParam);
  let data = await res.json();
  // console.log(data);
  // console.log(data.items);
  // console.log(data.items[0]);
  // console.log(data.items[0].snippet);
  // console.log(data.items[0].snippet.thumbnails);
  // console.log(data.items[0].snippet.thumbnails.high);
  // console.log(data.items[0].snippet.thumbnails.high.url);

  let channelIcon = data.items[0].snippet.thumbnails.high.url;
  getVideoDetails(video_data,channelIcon);
};
let getVideoDetails = async (video_data, channelIcon) => {
  if (!video_data || !video_data.snippet || !video_data.snippet.channelId) {
    console.error("Invalid video_data:", video_data);
    return;
  }
  let videoParam = new URLSearchParams({
    key: API_KEY, //M
    part: "snippet,contentDetails,statistics,status",
    id: video_data.id.videoId,
  });
  let res = await fetch(VIDEO_DETAILS + videoParam);
  let data = await res.json();
  // console.log(data);
  console.log(data.items[0].statistics.viewCount);
  console.log((data.items[0].statistics.viewCount).length);

  let VideoView = data.items[0].statistics.viewCount;

  appendVideosIntoContainer(video_data, channelIcon, VideoView);
};

let main_content = document.getElementsByClassName("main_content")[0];
let appendVideosIntoContainer = (video_data, channelIcon, VideoView) => {
  // if (main_content.length > 0) {
  // let main_content = main_content[0]; // Assuming you want to update the first section
  main_content.innerHTML += `
    <a href="https://www.youtube.com/watch?v=${video_data.id.videoId}">
    <section>
      <div class="video">
            <img src="${video_data.snippet.thumbnails.high.url}" alt="video1" />
             </a>
            <div class="video_info">
              <img src="${channelIcon}" alt="photo" />
              <div class="video_text">
                <h4>${video_data.snippet.title}</h4>
                <p>${
                  VideoView.length > 8
                    ? Math.floor(VideoView / 1000000)+"M"
                    : (VideoView.length>7)?Math.floor(VideoView / 1000000)+"M":(VideoView.length>6)?Math.ceil(VideoView / 1000000)+"M"
                    :(VideoView.length>5)?Math.floor(VideoView / 1000)+"K":(VideoView.length>4)?Math.floor(VideoView/1000)+"K":(VideoView.length>3)?Math.floor(VideoView/100)+"K":VideoView
                } views  1 month ago</p>
              </div>
            </div>
      </div> 
      <section>
     
    `;
  // } else {
  //   console.error("No section elements found in the DOM.");
  // }
};

search_button = document.getElementById("search_button");

search_button.addEventListener("click", () => {
  console.log("event trigger");

  let user_input = document.getElementById("userInput").value;
  console.log("you mada a request for", user_input, "data");
  main_content.innerHTML = "";
  CallYoutubeDataAPI(user_input);
});
