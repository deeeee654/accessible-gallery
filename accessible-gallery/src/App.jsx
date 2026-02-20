import { useState } from "react";
import { useEffect } from "react";
import Images from "./components/Images";
import "./App.css";
//To create a React component that displays an image gallery with auto-play and keyboard navigation features, and fetches images from an external API
export default function App() {
  const [images, setImages] = useState([]);
  const [index, setCurrentIndex] = useState(0);
  const [isAuto, setIsAuto] = useState(false);

  //To fetch data from external API and set it to the state variable "images"
  useEffect(() => {
    async function fetchData() {
      const resp = await fetch(
        `https://api.unsplash.com/photos/?page=1&per_page=10&client_id=${import.meta.env.VITE_ACC_KEY}`,
      );
      const data = await resp.json();
      console.log(data); // Add this to check the data
      setImages(data);
    }
    fetchData();
  }, []);

  //To handle the click event on the thumbnail images and update the current index and auto-play state
  function handleThumbnailClick(index) {
    console.log(index);
    setCurrentIndex(index);
    setIsAuto(false);
  }

  //To set up an interval that automatically changes the current index every 3 seconds if auto-play is enabled and there are images available
  useEffect(() => {
    if (images.length === 0 || !isAuto) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length, isAuto]);

  //To handle keydown events for space and enter keys to change the current index and disable auto-play
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setIsAuto(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length]);

  //To create an array of image elements based on the fetched images and render them in the component
  const imageArray = [Images];
  for (let i = 0; i < images.length; i++) {
    imageArray.push(
      <div key={i} className="image-container">
        <img src={images[i].url} alt={`Image ${i + 1}`} />
      </div>,
    );
  }

  //To render the main component with a background image based on the current index and a set of thumbnail images that can be clicked to change the current index
  return (
    <div
      style={{
        backgroundImage: images[index]
          ? `url(${images[index].urls.regular})`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="thumbnails">
        {images.map((image, index) => {
          return (
            <div onClick={() => handleThumbnailClick(index)}>
              <img src={image.urls.thumb} alt={image.alt_description} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
