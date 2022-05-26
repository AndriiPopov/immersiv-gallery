import video from "./video.svg";
import plan from "./plan.svg";
import photo from "./photo.svg";
import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import YouTube from "react-youtube";

const baseURL =
    process.env.NODE_ENV === "production"
        ? "https://tour.immersiv.com.au/api"
        : "http://localhost:5000/api";

function App() {
    const [items, setItems] = useState([]);
    const [tab, setTab] = useState("");
    const [slide, setSlide] = useState(0);
    useEffect(() => {
        const search = window.location.search;
        if (!search) {
            console.log("no query in url");
            return;
        }
        const params = new URLSearchParams(search);
        if (!search) {
            console.log("something is wrong with the query");
            return;
        }
        const url = params.get("project");
        if (!url) {
            console.log("no id in the query");
            return;
        }
        axios
            .get(`${baseURL}/projects/url${url ? "/" + url : ""}`)
            .then((res) => {
                if (res.data && res.data.media) setItems(res.data.media);
                else console.log("data or media in the project is empty");
            })
            .catch((er) => {
                console.log("could not get project from server");
                console.log(er);
            });
    }, []);

    const images =
        items
            .filter((i) => (tab ? tab === i.type : true))
            .map((i, index) => {
                if (i.type !== "video") {
                    return {
                        ...i,
                        original: i.url,
                        thumbnail: i.url,
                        // description: i.name,
                        originalClass: "featured-slide",
                        thumbnailClass: "featured-thumb",
                    };
                } else {
                    return {
                        ...i,
                        index,
                        thumbnail: `https://img.youtube.com/vi/${i.url}/default.jpg`,
                        renderItem: (k) => {
                            console.log(slide, k.index);

                            return slide === k.index ? (
                                <YouTube
                                    videoId={k.url}
                                    className="youtubeContainer"
                                    opts={{
                                        width: "100%",
                                        height: "100%",
                                    }}
                                    playerVars={{
                                        autoplay: 1,
                                    }}
                                />
                            ) : null;
                        },
                    };
                }
            })
            .filter((i) => i) || [];

    const handleTabClick = (newTab) => {
        setTab(newTab === tab ? "" : newTab);
    };

    return (
        <div className="App">
            <div className="buttons">
                <div
                    onClick={() => handleTabClick("photo")}
                    className={tab === "photo" ? "active" : undefined}
                >
                    <img src={photo} />
                </div>
                <div
                    onClick={() => handleTabClick("plan")}
                    className={tab === "plan" ? "active" : undefined}
                >
                    <img src={plan} />
                </div>
                <div
                    onClick={() => handleTabClick("video")}
                    className={tab === "video" ? "active" : undefined}
                >
                    <img src={video} />
                </div>
            </div>
            <ImageGallery
                items={images}
                showBullets={false}
                showFullscreenButton={false}
                showPlayButton={false}
                // showNav={false}
                thumbnailPosition="right"
                onSlide={setSlide}
                startIndex={slide}
            />
        </div>
    );
}

export default App;
