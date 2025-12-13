"use client";
import { useEffect } from "react";
import "/Users/krismehra/Downloads/project/src/components/ui/custom-cursor.css"; // <-- your CSS file

const CustomCursor = () => {
  useEffect(() => {
    const cursor = document.createElement("div");
    cursor.className = "custom-cursor";

    cursor.innerHTML = `
      <div class="cursor-dot"></div>
      <div class="cursor-ring"></div>
    `;

    document.body.appendChild(cursor);

    const dot = cursor.querySelector(".cursor-dot") as HTMLElement;
    const ring = cursor.querySelector(".cursor-ring") as HTMLElement;

    const moveCursor = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      dot.style.transform = `translate(${clientX}px, ${clientY}px)`;
      ring.style.transform = `translate(${clientX}px, ${clientY}px)`;
    };

    const addHover = () => cursor.classList.add("hover");
    const removeHover = () => cursor.classList.remove("hover");

    const clickEffect = (e: MouseEvent) => {
      cursor.classList.add("click");
      setTimeout(() => cursor.classList.remove("click"), 150);

      // ------- SHOCKWAVE RIPPLE -------
      const ripple = document.createElement("div");
      ripple.className = "cursor-ripple";
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      document.body.appendChild(ripple);

      setTimeout(() => ripple.remove(), 550);

      // ------- GLITTER PARTICLES -------
      for (let i = 0; i < 4; i++) {
        const glitter = document.createElement("div");
        glitter.className = "glitter";

        const offsetX = (Math.random() - 0.5) * 40;
        const offsetY = (Math.random() - 0.5) * 40;

        glitter.style.left = `${e.clientX + offsetX}px`;
        glitter.style.top = `${e.clientY + offsetY}px`;
        document.body.appendChild(glitter);

        setTimeout(() => glitter.remove(), 500);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", clickEffect);

    document.querySelectorAll("a, button, .clickable").forEach((el) => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", clickEffect);
      cursor.remove();
    };
  }, []);

  return null;
};

export default CustomCursor;
