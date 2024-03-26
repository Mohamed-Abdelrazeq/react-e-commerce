import React, { useEffect, useRef, useState } from "react";

export default function Carousel() {
  return (
    <div>
      <CustomCarousel>
        {new Array(10).fill("").map((_, index) => {
          return <Box index={index} key={index} />;
        })}
      </CustomCarousel>
    </div>
  );
}

function CustomCarousel(props) {
  const slider = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(null);
  const scrollLeft = useRef(null);
  const dragStartTime = useRef(null);
  const upWalk = useRef(null);

  useEffect(() => {
    if (slider && slider.current) {
      let sliderRef = slider.current;
      sliderRef.addEventListener("mousedown", one);

      sliderRef.addEventListener("mouseleave", three);
      sliderRef.addEventListener("mouseup", four);
      sliderRef.addEventListener("mousemove", five);

      return () => {
        sliderRef.removeEventListener("mousedown", one);
        sliderRef.removeEventListener("mouseleave", three);
        sliderRef.removeEventListener("mouseup", four);
        sliderRef.removeEventListener("mousemove", five);
      };
    }
  }, []);

  function one(e) {
    isDown.current = true;
    startX.current = e.pageX - slider.current.offsetLeft;
    scrollLeft.current = slider.current.scrollLeft;
  }

  function three() {
    isDown.current = false;
    upWalk.current = null;
    dragStartTime.current = null;
    slider.current.style.transform = `none`;
  }

  function four() {
    isDown.current = false;
    slider.current.style.transform = `none`;

    // Check if there's any remaining walk distance for animation
    if (upWalk.current && dragStartTime.current) {
      const duration = 300;
      // get the current time at the start of the animation
      let zeroTime = performance.now();
      let xVelocity =
        // the velocity multiplier can be named the friction multiplier the higher the number the less the friction which means higher initial velocity
        Math.round(upWalk.current / (dragStartTime.current - zeroTime)) * 8;
      // const step = Math.min(xVelocity / duration);
      const animationFunction = () => {
        const value = (performance.now() - zeroTime) / duration;
        if (value < 1 && xVelocity !== 0) {
          slider.current.scrollLeft = slider.current.scrollLeft + xVelocity;
          xVelocity = xVelocity * 0.96;
          requestAnimationFrame((t) => animationFunction(t));
        } else {
          dragStartTime.current = null;
          upWalk.current = null;
        }
      };

      requestAnimationFrame(animationFunction);
    }
  }
  function five(e) {
    if (!isDown.current) return;
    if (!dragStartTime.current) {
      dragStartTime.current = performance.now();
    }
    e.preventDefault();
    const x = e.pageX - slider.current.offsetLeft;
    const walk = x - startX.current;

    slider.current.scrollLeft = scrollLeft.current - walk;

    if (
      slider.current.scrollLeft >=
        slider.current.scrollWidth - slider.current.offsetWidth ||
      slider.current.scrollLeft <= 0
    ) {
      if (walk > 0) {
        slider.current.style.transform = `translateX(${Math.min(walk, 100)}px)`;
      } else {
        slider.current.style.transform = `translateX(${Math.max(
          walk,
          -100
        )}px)`;
      }
    } else {
      slider.current.style.transform = `none`;
    }

    upWalk.current = walk;
  }

  return (
    <div
      className="overflow-hidden whitespace-nowrap transition-transform duration-300 ease-out mt-2 "
      ref={slider}
    >
      {props.children}
    </div>
  );
}

function Box({ index }) {
  return (
    <div
      className={`inline-block ${
        index === 9 ? "" : "mr-4"
      } w-72 max-w-full h-72 bg-red-50 `}
    >
      Box {index}
    </div>
  );
}
