import { ComponentProps } from "solid-js";

export const Two = (props: ComponentProps<"svg">) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <g clip-path="url(#clip0_429_10997)">
        {" "}
        <path
          d="M8 8C8 6.97631 8.39052 5.95262 9.17157 5.17157C10.7337 3.60947 13.2663 3.60947 14.8284 5.17157C16.3905 6.73366 16.3905 9.26632 14.8284 10.8284L9.17157 16.4853C8.42143 17.2354 8 18.2528 8 19.3137L8 20L16 20"
          stroke="#1a872a"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>{" "}
      </g>{" "}
      <defs>
        {" "}
        <clipPath id="clip0_429_10997">
          {" "}
          <rect width="24" height="24" fill="none"></rect>{" "}
        </clipPath>{" "}
      </defs>{" "}
    </g>
  </svg>
);
