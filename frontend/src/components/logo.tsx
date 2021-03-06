import * as React from 'react'

interface LogoProps {
    height?: number | string
    width?: number | string
}

export const Logo:React.FC<LogoProps> = ({ width, height }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            fill="none"
            viewBox="0 0 503 150"
        >
            <mask
                id="mask0_182:212"
                style={{ maskType: 'alpha' }}
                width="139"
                height="150"
                x="0"
                y="0"
                maskUnits="userSpaceOnUse"
            >
                <path
                    fill="#fff"
                    d="M0 0v150h32.983v-48.319l18.908-19.118L97.059 150h41.386L74.16 59.244 132.773 0H91.597L32.983 62.185V0H0z"
                ></path>
            </mask>
            <g fillRule="evenodd" clipRule="evenodd" mask="url(#mask0_182:212)">
                <path
                    fill="url(#paint0_linear_182:212)"
                    d="M-13.252 146.995c-21.172-49.08-54.847-58.087-67.871-57.001l-.606-7.27c16.572-1.38 52.94 9.836 75.175 61.382 21.256 49.276 57.424 68.88 72.13 72.509l-1.747 7.083c-16.944-4.181-54.93-25.353-77.081-76.703z"
                ></path>
                <path
                    fill="url(#paint1_linear_182:212)"
                    d="M-4.285 138.219C-25.51 89.015-59.319 79.898-72.52 80.999l-.545-6.543c16.394-1.367 52.627 9.74 74.81 61.162 21.3 49.38 57.559 69.063 72.378 72.719l-1.573 6.374c-16.832-4.153-54.728-25.246-76.834-76.492z"
                ></path>
                <path
                    fill="url(#paint2_linear_182:212)"
                    d="M4.347 129.586c-21.225-49.203-55.034-58.32-68.236-57.22l-.545-6.542c16.394-1.367 52.627 9.74 74.81 61.162 21.3 49.38 57.559 69.063 72.378 72.719l-1.573 6.374c-16.832-4.153-54.728-25.247-76.834-76.493z"
                ></path>
                <path
                    fill="url(#paint3_linear_182:212)"
                    d="M13.314 120.81C-7.964 71.483-41.908 62.256-55.287 63.37l-.485-5.815c16.217-1.351 52.316 9.645 74.445 60.944 21.345 49.483 57.695 69.244 72.625 72.928l-1.398 5.666c-16.72-4.126-54.524-25.141-76.586-76.283z"
                ></path>
                <path
                    fill="url(#paint4_linear_182:212)"
                    d="M21.946 112.178C.668 62.851-33.276 53.624-46.655 54.738l-.485-5.815c16.217-1.352 52.316 9.644 74.445 60.943C48.65 159.35 85 179.111 99.93 182.795l-1.398 5.666c-16.72-4.126-54.524-25.141-76.586-76.283z"
                ></path>
                <path
                    fill="url(#paint5_linear_182:212)"
                    d="M30.913 103.401c-21.331-49.45-55.41-58.788-68.967-57.658l-.424-5.089c16.04-1.336 52.004 9.549 74.08 60.725 21.39 49.587 57.83 69.426 72.873 73.138l-1.223 4.958c-16.609-4.099-54.322-25.035-76.339-76.074z"
                ></path>
                <path
                    fill="url(#paint6_linear_182:212)"
                    d="M39.545 94.77C18.214 45.32-15.865 35.98-29.42 37.11l-.425-5.088c16.04-1.336 52.004 9.549 74.08 60.725 21.39 49.587 57.831 69.426 72.873 73.138l-1.223 4.958c-16.609-4.099-54.322-25.035-76.339-76.074z"
                ></path>
                <path
                    fill="url(#paint7_linear_182:212)"
                    d="M48.513 85.993C27.128 36.42-7.086 26.97-20.82 28.115l-.364-4.361c15.862-1.322 51.692 9.453 73.714 60.505 21.435 49.691 57.967 69.609 73.121 73.348l-1.048 4.249c-16.497-4.07-54.12-24.928-76.091-75.863z"
                ></path>
                <path
                    fill="url(#paint8_linear_182:212)"
                    d="M57.145 77.36C35.76 27.788 1.546 18.34-12.187 19.483l-.364-4.362C3.311 13.8 39.141 24.575 61.163 75.627c21.436 49.691 57.967 69.609 73.121 73.348l-1.048 4.249c-16.497-4.07-54.12-24.929-76.091-75.863z"
                ></path>
                <path
                    fill="url(#paint9_linear_182:212)"
                    d="M66.112 68.584C44.674 18.888 10.325 9.328-3.586 10.488l-.303-3.635c15.685-1.307 51.38 9.357 73.35 60.286 21.48 49.795 58.102 69.791 73.368 73.558l-.874 3.541c-16.385-4.043-53.916-24.823-75.844-75.654z"
                ></path>
                <path
                    fill="url(#paint10_linear_182:212)"
                    d="M83.71 51.175C62.22 1.355 27.737-8.315 13.648-7.14l-.242-2.908C28.913-11.34 64.473-.786 86.39 50.02c21.524 49.898 58.237 69.972 73.615 73.767l-.699 2.833c-16.272-4.016-53.713-24.717-75.596-75.445z"
                ></path>
                <path
                    fill="url(#paint11_linear_182:212)"
                    d="M101.31 33.767C79.766-16.176 45.148-25.957 30.882-24.768l-.181-2.18c15.33-1.278 50.755 9.165 72.618 59.848 21.57 50.002 58.374 70.155 73.864 73.977l-.525 2.125c-16.161-3.988-53.51-24.611-75.348-75.235z"
                ></path>
                <path
                    fill="url(#paint12_linear_182:212)"
                    d="M118.909 16.358c-21.597-50.066-56.35-59.957-70.793-58.753l-.121-1.454c15.153-1.263 50.443 9.07 72.253 59.63 21.614 50.105 58.509 70.336 74.111 74.186l-.349 1.416c-16.049-3.96-53.308-24.505-75.101-75.025z"
                ></path>
                <path
                    fill="url(#paint13_linear_182:212)"
                    d="M74.743 59.952C53.306 10.255 13.742-.21-.169.949l-.303-3.634C15.213-3.992 56.123 7.578 78.093 58.507c21.48 49.794 58.102 69.791 73.368 73.558l-.874 3.541c-16.385-4.043-53.916-24.823-75.843-75.654z"
                ></path>
                <path
                    fill="url(#paint14_linear_182:212)"
                    d="M92.342 42.543C70.852-7.277 36.37-16.947 22.28-15.772l-.242-2.908c15.507-1.292 51.067 9.262 72.984 60.068 21.524 49.898 58.237 69.972 73.615 73.767l-.699 2.833c-16.272-4.016-53.713-24.717-75.596-75.445z"
                ></path>
                <path
                    fill="url(#paint15_linear_182:212)"
                    d="M109.942 25.135C88.398-24.808 53.78-34.59 39.514-33.4l-.181-2.18c15.33-1.278 50.755 9.165 72.618 59.848 21.57 50.001 58.374 70.155 73.864 73.977l-.525 2.124c-16.161-3.987-53.51-24.61-75.348-75.234z"
                ></path>
                <path
                    fill="url(#paint16_linear_182:212)"
                    d="M127.541 7.726C105.944-42.34 71.191-52.23 56.749-51.027l-.122-1.454c15.153-1.263 50.444 9.07 72.254 59.63 21.614 50.105 58.509 70.337 74.111 74.186l-.35 1.417c-16.049-3.96-53.308-24.505-75.101-75.026z"
                ></path>
            </g>
            <path
                fill="#fff"
                d="M188 26.183v49.703h6.602V58.483l8.27-7.727 17.931 25.13h8.339L207.39 46.232l20.918-20.049h-8.548l-25.158 24.782V26.183H188zM273.358 26.183v49.703h6.255V36h.139l25.922 39.887h7.228V26.183h-6.255V66.49h-.139l-26.131-40.306h-7.019zM332.848 26.183v49.703h34.471v-5.569H339.45V53.123h25.784v-5.569H339.45V31.752h27.66v-5.569h-34.262zM395.858 31.752v44.134h6.603V31.752h16.54v-5.569h-39.683v5.57h16.54zM434.051 26.183v49.703h6.602V26.183h-6.602zM495.911 41.15h6.603c-.371-2.645-1.159-4.966-2.363-6.961-1.205-2.042-2.711-3.736-4.518-5.082-1.807-1.346-3.868-2.367-6.185-3.063-2.316-.696-4.772-1.044-7.367-1.044-3.799 0-7.181.696-10.146 2.088-2.919 1.346-5.375 3.203-7.367 5.57-1.946 2.366-3.428 5.15-4.448 8.353-1.019 3.155-1.529 6.543-1.529 10.163s.464 7.008 1.39 10.163c.973 3.156 2.41 5.894 4.309 8.215 1.9 2.32 4.286 4.153 7.158 5.499 2.873 1.3 6.232 1.949 10.077 1.949 6.348 0 11.352-1.74 15.012-5.22 3.66-3.481 5.814-8.354 6.463-14.62h-6.602c-.139 2.043-.556 3.945-1.251 5.709-.695 1.763-1.668 3.295-2.919 4.594-1.205 1.253-2.664 2.251-4.378 2.994-1.668.696-3.591 1.044-5.769 1.044-2.965 0-5.513-.557-7.644-1.671-2.131-1.114-3.892-2.599-5.282-4.455-1.344-1.903-2.34-4.107-2.988-6.613-.649-2.553-.973-5.244-.973-8.075 0-2.6.324-5.105.973-7.518.648-2.413 1.644-4.548 2.988-6.405a15.301 15.301 0 015.212-4.524c2.132-1.114 4.68-1.671 7.645-1.671 3.475 0 6.463.882 8.965 2.645 2.548 1.764 4.193 4.409 4.934 7.936zM247.923 26.183v49.703h6.602V26.183h-6.602z"
            ></path>
            <g fill="#fff" opacity="0.4">
                <path d="M188.194 97.031v21.144h2.709v-2.043h.064c.298.454.659.839 1.084 1.155a6.63 6.63 0 001.402.711c.489.177.977.306 1.466.385.51.079.967.118 1.37.118 1.254 0 2.348-.207 3.283-.622.956-.414 1.742-.977 2.358-1.688a6.91 6.91 0 001.403-2.546 9.804 9.804 0 00.478-3.08 9.8 9.8 0 00-.478-3.08 7.321 7.321 0 00-1.434-2.547c-.617-.75-1.403-1.342-2.359-1.777-.935-.434-2.04-.651-3.314-.651-1.148 0-2.199.197-3.156.592-.956.375-1.657.987-2.103 1.836h-.064v-7.907h-2.709zm12.748 13.356a9.38 9.38 0 01-.255 2.191 5.567 5.567 0 01-.828 1.896 4.194 4.194 0 01-1.53 1.332c-.616.336-1.392.504-2.326.504-.935 0-1.732-.158-2.391-.474a4.883 4.883 0 01-1.625-1.303 5.376 5.376 0 01-.892-1.836 8.364 8.364 0 01-.287-2.191c0-.711.085-1.412.255-2.103a5.376 5.376 0 01.892-1.836 4.493 4.493 0 011.562-1.333c.637-.335 1.413-.503 2.326-.503.871 0 1.626.158 2.263.474.659.316 1.19.74 1.594 1.273.424.533.733 1.145.924 1.836a6.84 6.84 0 01.318 2.073zM215.452 120.219c-.319.75-.637 1.382-.956 1.895-.297.513-.637.928-1.02 1.244a3.092 3.092 0 01-1.243.711c-.446.158-.966.237-1.561.237-.319 0-.638-.02-.956-.06a4.755 4.755 0 01-.925-.207v-2.31c.234.099.5.178.797.237.319.079.584.119.797.119.552 0 1.009-.129 1.37-.385.383-.237.669-.583.861-1.037l1.115-2.576-6.533-15.222h3.059l4.813 12.527h.063l4.622-12.527h2.868l-7.171 17.354zM239.971 107.603c0-1.066.148-2.112.446-3.139a8.284 8.284 0 011.402-2.813c.638-.829 1.456-1.491 2.454-1.984.999-.514 2.189-.77 3.57-.77 1.381 0 2.57.256 3.569.77.999.493 1.817 1.155 2.454 1.984a8.266 8.266 0 011.402 2.813c.298 1.027.447 2.073.447 3.139 0 1.066-.149 2.123-.447 3.169a8.302 8.302 0 01-1.402 2.784c-.637.829-1.455 1.5-2.454 2.013-.999.494-2.188.741-3.569.741-1.381 0-2.571-.247-3.57-.741-.998-.513-1.816-1.184-2.454-2.013a8.32 8.32 0 01-1.402-2.784 11.516 11.516 0 01-.446-3.169zm-3.028 0c0 1.442.223 2.833.669 4.176a10.522 10.522 0 002.072 3.524c.913 1.027 2.05 1.846 3.41 2.458 1.36.592 2.943.888 4.749.888 1.806 0 3.388-.296 4.748-.888 1.36-.612 2.497-1.431 3.41-2.458a10.092 10.092 0 002.04-3.524c.468-1.343.701-2.734.701-4.176a12.34 12.34 0 00-.701-4.146 10.042 10.042 0 00-2.04-3.553c-.913-1.027-2.05-1.846-3.41-2.458-1.36-.612-2.942-.918-4.748-.918s-3.389.306-4.749.918c-1.36.612-2.497 1.431-3.41 2.458a10.461 10.461 0 00-2.072 3.553 12.89 12.89 0 00-.669 4.146zM264.073 102.865v21.144h2.709v-7.877h.064c.297.454.658.839 1.083 1.155a6.66 6.66 0 001.403.711c.488.177.977.306 1.466.385.51.079.966.118 1.37.118 1.254 0 2.348-.207 3.283-.622.956-.414 1.742-.977 2.358-1.688a6.894 6.894 0 001.402-2.546 9.775 9.775 0 00.479-3.08c0-1.086-.16-2.113-.479-3.08a7.29 7.29 0 00-1.434-2.547c-.616-.75-1.402-1.342-2.358-1.777-.935-.434-2.04-.651-3.315-.651-1.147 0-2.199.197-3.155.592-.956.375-1.657.987-2.103 1.836h-.064v-2.073h-2.709zm12.748 7.522a9.38 9.38 0 01-.255 2.191 5.586 5.586 0 01-.828 1.896 4.202 4.202 0 01-1.53 1.332c-.616.336-1.392.504-2.327.504s-1.731-.158-2.39-.474a4.873 4.873 0 01-1.625-1.303 5.378 5.378 0 01-.893-1.836 8.407 8.407 0 01-.287-2.191c0-.711.085-1.412.255-2.103a5.396 5.396 0 01.893-1.836 4.49 4.49 0 011.561-1.333c.638-.335 1.413-.503 2.327-.503.871 0 1.625.158 2.263.474.658.316 1.19.74 1.593 1.273a5.08 5.08 0 01.924 1.836 6.81 6.81 0 01.319 2.073zM296.303 109.054h-9.466a4.821 4.821 0 01.414-1.658c.234-.533.553-.997.957-1.392a4.23 4.23 0 011.434-.918c.573-.237 1.211-.355 1.912-.355.68 0 1.296.118 1.848.355a4.171 4.171 0 011.466.918c.425.375.755.829.988 1.362a4.66 4.66 0 01.447 1.688zm2.613 4.265h-2.677c-.234 1.007-.722 1.757-1.466 2.25-.723.494-1.657.741-2.805.741-.892 0-1.668-.138-2.326-.415-.659-.276-1.201-.641-1.626-1.095a4.39 4.39 0 01-.924-1.6 5.804 5.804 0 01-.255-1.925h12.334a10.947 10.947 0 00-.287-2.931 7.754 7.754 0 00-1.211-2.843c-.574-.869-1.349-1.58-2.326-2.132-.957-.573-2.168-.859-3.634-.859-1.126 0-2.167.197-3.123.592a7.532 7.532 0 00-2.454 1.658 7.674 7.674 0 00-1.593 2.518c-.383.967-.574 2.033-.574 3.198.042 1.165.223 2.241.542 3.228.34.987.839 1.836 1.498 2.547a6.784 6.784 0 002.422 1.658c.977.395 2.124.592 3.442.592 1.869 0 3.42-.434 4.653-1.303 1.232-.868 2.029-2.162 2.39-3.879zM303.971 102.865v15.31h2.709v-8.647c0-.691.096-1.322.287-1.895.212-.592.52-1.106.924-1.54a4.07 4.07 0 011.498-1.007c.616-.237 1.338-.355 2.167-.355 1.041 0 1.859.276 2.454.829.595.553.892 1.303.892 2.251v10.364h2.709v-10.068c0-.829-.095-1.58-.286-2.251a4.036 4.036 0 00-.925-1.777c-.446-.493-1.03-.878-1.753-1.155-.722-.276-1.625-.414-2.708-.414-2.444 0-4.229.928-5.355 2.783h-.063v-2.428h-2.55zM337.281 103.221h2.868c-.043-1.165-.287-2.162-.733-2.991a5.707 5.707 0 00-1.785-2.103c-.743-.553-1.615-.958-2.613-1.214-.999-.257-2.082-.385-3.251-.385-1.041 0-2.061.128-3.059.385a8.423 8.423 0 00-2.646 1.125 5.728 5.728 0 00-1.848 1.925c-.468.77-.701 1.688-.701 2.754 0 .967.202 1.777.605 2.428a5.29 5.29 0 001.657 1.57 11.28 11.28 0 002.359.977 57.68 57.68 0 002.645.652c.914.177 1.806.355 2.677.533.871.177 1.647.414 2.327.71.701.277 1.253.642 1.657 1.096.425.454.637 1.047.637 1.777 0 .77-.17 1.402-.51 1.895a3.733 3.733 0 01-1.338 1.185 6.653 6.653 0 01-1.88.592c-.68.119-1.36.178-2.04.178-.85 0-1.679-.099-2.486-.296a6.62 6.62 0 01-2.135-.918 5.12 5.12 0 01-1.466-1.57c-.362-.651-.542-1.421-.542-2.31h-2.868c0 1.284.244 2.399.733 3.347a6.893 6.893 0 002.039 2.309c.871.593 1.87 1.037 2.996 1.333 1.147.296 2.358.444 3.633.444 1.041 0 2.082-.118 3.124-.355a9.44 9.44 0 002.868-1.066 6.51 6.51 0 002.071-1.955c.553-.809.829-1.776.829-2.902 0-1.046-.212-1.915-.637-2.606a5.081 5.081 0 00-1.658-1.717 8.438 8.438 0 00-2.326-1.067 29.361 29.361 0 00-2.677-.71 69.603 69.603 0 00-2.645-.533 16.398 16.398 0 01-2.359-.652c-.68-.256-1.232-.582-1.657-.977-.404-.415-.606-.948-.606-1.599 0-.691.138-1.264.415-1.718.297-.474.68-.849 1.147-1.125a5.42 5.42 0 011.657-.592 9.935 9.935 0 011.881-.178c1.572 0 2.857.345 3.856 1.036 1.02.672 1.615 1.767 1.785 3.288zM350.091 102.865v-4.59h-2.709v4.59h-2.805v2.221h2.805v9.743c0 .711.074 1.283.223 1.718.148.434.371.77.669 1.007.319.237.722.404 1.211.503.51.079 1.115.118 1.817.118h2.071v-2.221h-1.243c-.425 0-.775-.009-1.052-.029a1.537 1.537 0 01-.605-.207.812.812 0 01-.319-.415 3.214 3.214 0 01-.063-.711v-9.506h3.282v-2.221h-3.282zM372.971 118.116c-.467.257-1.115.385-1.944.385-.701 0-1.264-.177-1.689-.533-.404-.375-.606-.977-.606-1.806a6.576 6.576 0 01-2.613 1.806c-.977.356-2.04.533-3.187.533a9.402 9.402 0 01-2.135-.237c-.659-.158-1.233-.404-1.721-.74a3.813 3.813 0 01-1.18-1.303c-.276-.553-.414-1.214-.414-1.984 0-.869.16-1.58.478-2.132a3.903 3.903 0 011.243-1.333 6.002 6.002 0 011.785-.8 24.48 24.48 0 012.071-.444 22.654 22.654 0 012.104-.296c.68-.079 1.275-.178 1.785-.296.51-.138.913-.326 1.211-.563.297-.256.446-.622.446-1.095 0-.553-.117-.997-.351-1.333a2.087 2.087 0 00-.86-.77 3.518 3.518 0 00-1.179-.355 9.109 9.109 0 00-1.275-.089c-1.147 0-2.104.207-2.868.622-.765.395-1.18 1.155-1.243 2.28h-2.709c.042-.948.255-1.747.637-2.399a4.49 4.49 0 011.53-1.569 6.494 6.494 0 012.167-.889c.829-.177 1.71-.266 2.645-.266.744 0 1.477.049 2.199.148a5.902 5.902 0 012.008.622c.595.296 1.073.72 1.434 1.273.361.553.542 1.274.542 2.162v7.877c0 .592.032 1.027.096 1.303.085.277.34.415.765.415.233 0 .509-.05.828-.148v1.954zm-4.398-7.847c-.34.237-.786.414-1.339.533a36.85 36.85 0 01-1.752.266c-.595.059-1.201.138-1.817.237a6.654 6.654 0 00-1.657.415 3.053 3.053 0 00-1.211.858c-.298.356-.446.849-.446 1.481 0 .415.084.77.254 1.066.192.277.425.504.702.681.297.178.637.306 1.019.385.383.079.787.119 1.212.119.892 0 1.657-.109 2.294-.326.638-.237 1.158-.523 1.562-.859.404-.355.701-.73.892-1.125.191-.415.287-.8.287-1.155v-2.576zM381.914 110.121l-6.183 8.054h3.283l4.589-6.337 4.59 6.337h3.474l-6.374-8.262 5.672-7.048h-3.25l-4.112 5.36-3.952-5.36h-3.473l5.736 7.256z"></path>
            </g>
            <defs>
                <linearGradient
                    id="paint0_linear_182:212"
                    x1="-0.255"
                    x2="128.612"
                    y1="149.917"
                    y2="1.496"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6C1DEC"></stop>
                    <stop offset="0.446" stopColor="#62DAFC"></stop>
                    <stop offset="0.811" stopColor="#0EE094"></stop>
                    <stop offset="1" stopColor="#0EE094"></stop>
                </linearGradient>
                <linearGradient
                    id="paint1_linear_182:212"
                    x1="-0.255"
                    x2="128.612"
                    y1="149.917"
                    y2="1.496"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6C1DEC"></stop>
                    <stop offset="0.446" stopColor="#62DAFC"></stop>
                    <stop offset="0.811" stopColor="#0EE094"></stop>
                    <stop offset="1" stopColor="#0EE094"></stop>
                </linearGradient>
                <linearGradient
                    id="paint2_linear_182:212"
                    x1="-0.255"
                    x2="128.612"
                    y1="149.917"
                    y2="1.496"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6C1DEC"></stop>
                    <stop offset="0.446" stopColor="#62DAFC"></stop>
                    <stop offset="0.811" stopColor="#0EE094"></stop>
                    <stop offset="1" stopColor="#0EE094"></stop>
                </linearGradient>
                <linearGradient
                    id="paint3_linear_182:212"
                    x1="-0.255"
                    x2="128.612"
                    y1="149.917"
                    y2="1.496"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6C1DEC"></stop>
                    <stop offset="0.446" stopColor="#62DAFC"></stop>
                    <stop offset="0.811" stopColor="#0EE094"></stop>
                    <stop offset="1" stopColor="#0EE094"></stop>
                </linearGradient>
                <linearGradient
                    id="paint4_linear_182:212"
                    x1="-0.255"
                    x2="128.612"
                    y1="149.917"
                    y2="1.496"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6C1DEC"></stop>
                    <stop offset="0.446" stopColor="#62DAFC"></stop>
                    <stop offset="0.811" stopColor="#0EE094"></stop>
                    <stop offset="1" stopColor="#0EE094"></stop>
                </linearGradient>
                <linearGradient
                    id="paint5_linear_182:212"
                    x1="-0.255"
                    x2="128.612"
                    y1="149.917"
                    y2="1.496"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6C1DEC"></stop>
                    <stop offset="0.446" stopColor="#62DAFC"></stop>
                    <stop offset="0.811" stopColor="#0EE094"></stop>
                    <stop offset="1" stopColor="#0EE094"></stop>
                </linearGradient>
                <linearGradient
                    id="paint6_linear_182:212"
                    x1="-0.255"
                    x2="128.612"
                    y1="149.917"
                    y2="1.496"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6C1DEC"></stop>
                    <stop offset="0.446" stopColor="#62DAFC"></stop>
                    <stop offset="0.811" stopColor="#0EE094"></stop>
                    <stop offset="1" stopColor="#0EE094"></stop>
                </linearGradient>
                <linearGradient
                    id="paint7_linear_182:212"
                    x1="-0.255"
                    x2="128.612"
                    y1="149.917"
                    y2="1.496"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6C1DEC"></stop>
                    <stop offset="0.446" stopColor="#62DAFC"></stop>
                    <stop offset="0.811" stopColor="#0EE094"></stop>
                    <stop offset="1" stopColor="#0EE094"></stop>
                </linearGradient>
                <linearGradient
                    id="paint8_linear_182:212"
                    x1="-0.255"
                    x2="128.612"
                    y1="149.917"
                    y2="1.496"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6C1DEC"></stop>
                    <stop offset="0.446" stopColor="#62DAFC"></stop>
                    <stop offset="0.811" stopColor="#0EE094"></stop>
                    <stop offset="1" stopColor="#0EE094"></stop>
                </linearGradient>
                <linearGradient
                    id="paint9_linear_182:212"
                    x1="-0.255"
                    x2="128.612"
                    y1="149.917"
                    y2="1.496"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6C1DEC"></stop>
                    <stop offset="0.446" stopColor="#62DAFC"></stop>
                    <stop offset="0.811" stopColor="#0EE094"></stop>
                    <stop offset="1" stopColor="#0EE094"></stop>
                </linearGradient>
                <linearGradient
                    id="paint10_linear_182:212"
                    x1="-0.255"
                    x2="128.612"
                    y1="149.917"
                    y2="1.496"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6C1DEC"></stop>
                    <stop offset="0.446" stopColor="#62DAFC"></stop>
                    <stop offset="0.811" stopColor="#0EE094"></stop>
                    <stop offset="1" stopColor="#0EE094"></stop>
                </linearGradient>
                <linearGradient
                    id="paint11_linear_182:212"
                    x1="-0.255"
                    x2="128.612"
                    y1="149.917"
                    y2="1.496"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6C1DEC"></stop>
                    <stop offset="0.446" stopColor="#62DAFC"></stop>
                    <stop offset="0.811" stopColor="#0EE094"></stop>
                    <stop offset="1" stopColor="#0EE094"></stop>
                </linearGradient>
                <linearGradient
                    id="paint12_linear_182:212"
                    x1="-0.255"
                    x2="128.612"
                    y1="149.917"
                    y2="1.496"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6C1DEC"></stop>
                    <stop offset="0.446" stopColor="#62DAFC"></stop>
                    <stop offset="0.811" stopColor="#0EE094"></stop>
                    <stop offset="1" stopColor="#0EE094"></stop>
                </linearGradient>
                <linearGradient
                    id="paint13_linear_182:212"
                    x1="-0.255"
                    x2="128.612"
                    y1="149.917"
                    y2="1.496"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6C1DEC"></stop>
                    <stop offset="0.446" stopColor="#62DAFC"></stop>
                    <stop offset="0.811" stopColor="#0EE094"></stop>
                    <stop offset="1" stopColor="#0EE094"></stop>
                </linearGradient>
                <linearGradient
                    id="paint14_linear_182:212"
                    x1="-0.255"
                    x2="128.612"
                    y1="149.917"
                    y2="1.496"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6C1DEC"></stop>
                    <stop offset="0.446" stopColor="#62DAFC"></stop>
                    <stop offset="0.811" stopColor="#0EE094"></stop>
                    <stop offset="1" stopColor="#0EE094"></stop>
                </linearGradient>
                <linearGradient
                    id="paint15_linear_182:212"
                    x1="-0.255"
                    x2="128.612"
                    y1="149.917"
                    y2="1.496"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6C1DEC"></stop>
                    <stop offset="0.446" stopColor="#62DAFC"></stop>
                    <stop offset="0.811" stopColor="#0EE094"></stop>
                    <stop offset="1" stopColor="#0EE094"></stop>
                </linearGradient>
                <linearGradient
                    id="paint16_linear_182:212"
                    x1="-0.255"
                    x2="128.612"
                    y1="149.917"
                    y2="1.496"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6C1DEC"></stop>
                    <stop offset="0.446" stopColor="#62DAFC"></stop>
                    <stop offset="0.811" stopColor="#0EE094"></stop>
                    <stop offset="1" stopColor="#0EE094"></stop>
                </linearGradient>
            </defs>
        </svg>
    );
}
