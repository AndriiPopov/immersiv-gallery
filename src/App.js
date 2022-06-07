import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";

const baseURL =
    process.env.NODE_ENV === "production"
        ? "https://tour.immersiv.com.au/api"
        : "http://localhost:5000/api";

const useYTDimensions = (slide) => {
    const [dimensions, setDimensions] = useState({ width: 1, height: 2 });
    const [dimensionsW, setDimensionsW] = useState({ width: 1, height: 2 });
    useEffect(() => {
        window.addEventListener("resize", handleResize);
    }, []);
    useEffect(() => {
        handleResize();
    }, [slide]);
    const handleResize = () => {
        const refs = document.getElementsByClassName("image-gallery-slide");
        const ref = refs.length && refs[0];

        if (ref) {
            const boundingRect = ref.getBoundingClientRect();
            setDimensions({
                width: Math.round(boundingRect.width),
                height: Math.round(boundingRect.height),
            });
        }
        setDimensionsW({
            width: Math.round(window.innerWidth),
            height: Math.round(window.innerHeight),
        });
    };
    return { dimensions, dimensionsW };
};

function App() {
    const [items, setItems] = useState([]);
    const [tab, setTab] = useState("");
    const [slide, setSlide] = useState(0);
    const { dimensionsW } = useYTDimensions(slide);

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

    useEffect(() => {
        setSlide(0);
    }, [tab]);

    const images =
        items
            .filter((i) => (tab ? tab === i.type : true))
            .map((i, index) => {
                if (i.type !== "video") {
                    return {
                        ...i,
                        original: i.url,
                        thumbnail: i.thumbnail,
                        description: i.name,
                        originalClass: "featured-slide",
                        thumbnailClass: "featured-thumb",
                    };
                } else {
                    return {
                        ...i,
                        index,
                        thumbnail: i.url,
                        renderItem: (k) => {
                            return slide === k.index ? (
                                <video
                                    // id="my-player"
                                    // class="video-js"
                                    controls
                                    preload="auto"
                                    autoPlay
                                    muted
                                    // data-setup="{}"
                                    style={{ width: "100%", height: "100%" }}
                                >
                                    <source
                                        src={i.url}
                                        type="video/mp4"
                                    ></source>
                                    <p class="vjs-no-js">
                                        To view this video please enable
                                        JavaScript, and consider upgrading to a
                                        web browser that
                                        <a
                                            href="https://videojs.com/html5-video-support/"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            supports HTML5 video
                                        </a>
                                    </p>
                                </video>
                            ) : null;
                        },
                        renderThumbInner: (k) => (
                            <div style={{ position: "relative" }}>
                                <video
                                    id="my-player"
                                    class="video-js"
                                    controls
                                    data-setup="{}"
                                    style={{ width: "100%", height: "100%" }}
                                >
                                    <source
                                        src={i.url}
                                        type="video/mp4"
                                    ></source>
                                    <p class="vjs-no-js">
                                        To view this video please enable
                                        JavaScript, and consider upgrading to a
                                        web browser that
                                        <a
                                            href="https://videojs.com/html5-video-support/"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            supports HTML5 video
                                        </a>
                                    </p>
                                </video>
                                <div
                                    style={{
                                        position: "absolute",
                                        left: 0,
                                        right: 0,
                                        top: 0,
                                        bottom: 0,
                                    }}
                                />
                            </div>
                        ),
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
                    <img src="/gallery/photo.png" />
                </div>
                <div
                    onClick={() => handleTabClick("plan")}
                    className={tab === "plan" ? "active" : undefined}
                >
                    <img src="/gallery/plan.png" />
                </div>
                <div
                    onClick={() => handleTabClick("video")}
                    className={tab === "video" ? "active" : undefined}
                >
                    <img src="/gallery/video.png" />
                </div>
            </div>
            <ImageGallery
                items={images}
                showBullets={false}
                showFullscreenButton={false}
                showPlayButton={false}
                // showNav={false}
                thumbnailPosition={
                    dimensionsW.height > dimensionsW.width ? "bottom" : "right"
                }
                onSlide={setSlide}
                startIndex={slide}
            />
        </div>
    );
}

export default App;
