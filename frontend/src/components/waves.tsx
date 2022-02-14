import React from 'react'

export const KineticWaves:React.FC<{ flipped: boolean }> = ({ flipped }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="622"
            height="380"
            fill="none"
            viewBox="0 0 622 380"
            css={{
                transform: flipped ? 'scaleX(-1) scaleY(-1)' : 'unset',
            }}
        >
            <path
                fill="url(#paint0_linear_8_418)"
                fillRule="evenodd"
                d="M436.856 317.101c-143.125 113.1-143.096 231.988-128.022 273.933l-23.432 8.418c-19.18-53.369-14.299-183.081 136.016-301.863C565.115 184.037 597.827 47.576 596.81-4.077l24.892-.5c1.172 59.51-35.101 203.346-184.846 321.678z"
                clipRule="evenodd"
            ></path>
            <path
                fill="url(#paint1_linear_8_418)"
                fillRule="evenodd"
                d="M400.005 295.314C256.52 408.699 256.304 528.128 271.583 570.644l-21.088 7.576c-18.975-52.798-14.34-181.968 135.616-300.466C530.111 163.963 563 27.134 561.976-24.913l22.402-.45c1.164 59.118-34.93 202.585-184.373 320.677z"
                clipRule="evenodd"
            ></path>
            <path
                fill="url(#paint2_linear_8_418)"
                fillRule="evenodd"
                d="M363.927 274.505C220.441 387.89 220.225 507.319 235.505 549.835l-21.089 7.576c-18.975-52.798-14.34-181.968 135.617-300.467C494.032 143.153 526.922 6.324 525.897-45.722l22.403-.45c1.163 59.117-34.931 202.584-184.373 320.677z"
                clipRule="evenodd"
            ></path>
            <path
                fill="url(#paint3_linear_8_418)"
                fillRule="evenodd"
                d="M327.076 252.719C183.232 366.388 182.77 486.359 198.255 529.446l-18.746 6.734c-18.769-52.227-14.38-180.856 135.217-299.07C459.028 123.08 492.095-14.118 491.063-66.557l19.914-.4c1.156 58.725-34.761 201.823-183.901 319.676z"
                clipRule="evenodd"
            ></path>
            <path
                fill="url(#paint4_linear_8_418)"
                fillRule="evenodd"
                d="M290.998 231.91C147.153 345.579 146.691 465.549 162.176 508.637l-18.746 6.734c-18.769-52.227-14.38-180.856 135.217-299.07 144.302-114.03 177.37-251.228 176.337-303.667l19.914-.4c1.156 58.724-34.76 201.823-183.9 319.676z"
                clipRule="evenodd"
            ></path>
            <path
                fill="url(#paint5_linear_8_418)"
                fillRule="evenodd"
                d="M254.147 210.125C109.943 324.078 109.235 444.589 124.925 488.248l-16.402 5.892c-18.564-51.655-14.42-179.743 134.818-297.673C387.945 82.197 421.19-55.369 420.15-108.201l17.425-.349c1.148 58.33-34.59 201.06-183.428 318.675z"
                clipRule="evenodd"
            ></path>
            <path
                fill="url(#paint6_linear_8_418)"
                fillRule="evenodd"
                d="M218.069 189.315C73.864 303.268 73.157 423.78 88.847 467.438l-16.402 5.893c-18.564-51.656-14.42-179.744 134.817-297.674C351.866 61.388 385.112-76.179 384.072-129.01l17.424-.35c1.148 58.331-34.59 201.06-183.427 318.675z"
                clipRule="evenodd"
            ></path>
            <path
                fill="url(#paint7_linear_8_418)"
                fillRule="evenodd"
                d="M181.218 167.529C36.654 281.766 35.701 402.818 51.596 447.048l-14.059 5.051c-18.359-51.084-14.46-178.631 134.418-296.277C316.861 41.314 350.285-96.622 349.237-149.846l14.935-.3c1.141 57.938-34.419 200.3-182.954 317.675z"
                clipRule="evenodd"
            ></path>
            <path
                fill="url(#paint8_linear_8_418)"
                fillRule="evenodd"
                d="M145.139 146.719C.575 260.956-.378 382.009 15.518 426.239l-14.06 5.05c-18.358-51.084-14.46-178.631 134.418-296.277 144.907-114.508 178.33-252.443 177.283-305.668l14.935-.299c1.14 57.938-34.42 200.299-182.955 317.674z"
                clipRule="evenodd"
            ></path>
            <path
                fill="url(#paint9_linear_8_418)"
                fillRule="evenodd"
                d="M108.289 124.934C-36.635 239.455-37.833 361.049-21.732 405.85l-11.716 4.209c-18.154-50.513-14.5-177.519 134.018-294.881C245.778.431 279.38-137.873 278.325-191.49l12.446-.25c1.133 57.545-34.25 199.538-182.482 316.674z"
                clipRule="evenodd"
            ></path>
            <path
                fill="url(#paint10_linear_8_418)"
                fillRule="evenodd"
                d="M35.36 82.34C-109.925 197.144-111.369 319.28-95.063 364.651l-9.372 3.367c-17.949-49.942-14.541-176.406 133.618-293.484C174.695-40.451 208.475-179.124 207.412-233.134l9.957-.2c1.125 57.153-34.079 198.776-182.01 315.673z"
                clipRule="evenodd"
            ></path>
            <path
                fill="url(#paint11_linear_8_418)"
                fillRule="evenodd"
                d="M-37.57 39.743c-145.643 115.09-147.332 237.766-130.821 283.709l-7.029 2.526c-17.743-49.371-14.581-175.294 133.218-292.088C103.612-81.335 137.57-220.377 136.5-274.78l7.468-.15c1.117 56.76-33.909 198.015-181.537 314.673z"
                clipRule="evenodd"
            ></path>
            <path
                fill="url(#paint12_linear_8_418)"
                fillRule="evenodd"
                d="M-110.499-2.851c-146.002 115.373-147.937 238.59-131.22 285.105l-4.687 1.684c-17.538-48.8-14.621-174.182 132.819-290.692C32.529-122.217 66.665-261.628 65.586-316.424l4.979-.1C71.675-260.157 36.826-119.271-110.5-2.851z"
                clipRule="evenodd"
            ></path>
            <path
                fill="url(#paint13_linear_8_418)"
                fillRule="evenodd"
                d="M72.21 104.125C-72.714 218.646-72.295 358.221-56.195 403.022l-11.716 4.209c-18.153-50.513-16.117-195.5 132.402-312.862C209.7-20.378 243.302-158.683 242.246-212.3l12.446-.25c1.133 57.546-34.249 199.538-182.482 316.675z"
                clipRule="evenodd"
            ></path>
            <path
                fill="url(#paint14_linear_8_418)"
                fillRule="evenodd"
                d="M-.72 61.53c-145.282 114.805-146.726 236.94-130.42 282.312l-9.373 3.367c-17.948-49.942-14.54-176.406 133.619-293.484C138.617-61.26 172.397-199.934 171.333-253.944l9.957-.2C182.415-196.991 147.211-55.368-.72 61.53z"
                clipRule="evenodd"
            ></path>
            <path
                fill="url(#paint15_linear_8_418)"
                fillRule="evenodd"
                d="M-73.649 18.934c-145.642 115.089-147.332 237.765-130.82 283.709l-7.03 2.525C-229.242 255.797-226.08 129.874-78.28 13.08 67.533-102.144 101.49-241.186 100.42-295.589l7.468-.15c1.117 56.76-33.909 198.014-181.537 314.673z"
                clipRule="evenodd"
            ></path>
            <path
                fill="url(#paint16_linear_8_418)"
                fillRule="evenodd"
                d="M-146.577-23.663c-146.001 115.374-147.936 238.591-131.22 285.106l-4.686 1.683c-17.538-48.799-14.621-174.181 132.819-290.691C-3.548-143.029 30.588-282.439 29.509-337.235l4.978-.1C35.597-280.968.75-140.082-146.577-23.663z"
                clipRule="evenodd"
            ></path>
            <defs>
                <linearGradient
                    id="paint0_linear_8_418"
                    x1="435.018"
                    x2="-167.817"
                    y1="271.706"
                    y2="-22.19"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6C1DEC"></stop>
                    <stop offset="0.446" stopColor="#62DAFC"></stop>
                    <stop offset="0.811" stopColor="#0EE094"></stop>
                    <stop offset="1" stopColor="#0EE094"></stop>
                </linearGradient>
                <linearGradient
                    id="paint1_linear_8_418"
                    x1="435.018"
                    x2="-167.817"
                    y1="271.706"
                    y2="-22.19"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6C1DEC"></stop>
                    <stop offset="0.446" stopColor="#62DAFC"></stop>
                    <stop offset="0.811" stopColor="#0EE094"></stop>
                    <stop offset="1" stopColor="#0EE094"></stop>
                </linearGradient>
                <linearGradient
                    id="paint2_linear_8_418"
                    x1="435.018"
                    x2="-167.817"
                    y1="271.706"
                    y2="-22.19"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6C1DEC"></stop>
                    <stop offset="0.446" stopColor="#62DAFC"></stop>
                    <stop offset="0.811" stopColor="#0EE094"></stop>
                    <stop offset="1" stopColor="#0EE094"></stop>
                </linearGradient>
                <linearGradient
                    id="paint3_linear_8_418"
                    x1="435.018"
                    x2="-167.817"
                    y1="271.706"
                    y2="-22.19"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6C1DEC"></stop>
                    <stop offset="0.446" stopColor="#62DAFC"></stop>
                    <stop offset="0.811" stopColor="#0EE094"></stop>
                    <stop offset="1" stopColor="#0EE094"></stop>
                </linearGradient>
                <linearGradient
                    id="paint4_linear_8_418"
                    x1="435.018"
                    x2="-167.817"
                    y1="271.706"
                    y2="-22.19"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6C1DEC"></stop>
                    <stop offset="0.446" stopColor="#62DAFC"></stop>
                    <stop offset="0.811" stopColor="#0EE094"></stop>
                    <stop offset="1" stopColor="#0EE094"></stop>
                </linearGradient>
                <linearGradient
                    id="paint5_linear_8_418"
                    x1="435.018"
                    x2="-167.817"
                    y1="271.706"
                    y2="-22.19"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6C1DEC"></stop>
                    <stop offset="0.446" stopColor="#62DAFC"></stop>
                    <stop offset="0.811" stopColor="#0EE094"></stop>
                    <stop offset="1" stopColor="#0EE094"></stop>
                </linearGradient>
                <linearGradient
                    id="paint6_linear_8_418"
                    x1="435.018"
                    x2="-167.817"
                    y1="271.706"
                    y2="-22.19"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6C1DEC"></stop>
                    <stop offset="0.446" stopColor="#62DAFC"></stop>
                    <stop offset="0.811" stopColor="#0EE094"></stop>
                    <stop offset="1" stopColor="#0EE094"></stop>
                </linearGradient>
                <linearGradient
                    id="paint7_linear_8_418"
                    x1="435.018"
                    x2="-167.817"
                    y1="271.706"
                    y2="-22.19"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6C1DEC"></stop>
                    <stop offset="0.446" stopColor="#62DAFC"></stop>
                    <stop offset="0.811" stopColor="#0EE094"></stop>
                    <stop offset="1" stopColor="#0EE094"></stop>
                </linearGradient>
                <linearGradient
                    id="paint8_linear_8_418"
                    x1="435.018"
                    x2="-167.817"
                    y1="271.706"
                    y2="-22.19"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6C1DEC"></stop>
                    <stop offset="0.446" stopColor="#62DAFC"></stop>
                    <stop offset="0.811" stopColor="#0EE094"></stop>
                    <stop offset="1" stopColor="#0EE094"></stop>
                </linearGradient>
                <linearGradient
                    id="paint9_linear_8_418"
                    x1="435.018"
                    x2="-167.817"
                    y1="271.706"
                    y2="-22.19"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6C1DEC"></stop>
                    <stop offset="0.446" stopColor="#62DAFC"></stop>
                    <stop offset="0.811" stopColor="#0EE094"></stop>
                    <stop offset="1" stopColor="#0EE094"></stop>
                </linearGradient>
                <linearGradient
                    id="paint10_linear_8_418"
                    x1="435.018"
                    x2="-167.817"
                    y1="271.706"
                    y2="-22.19"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6C1DEC"></stop>
                    <stop offset="0.446" stopColor="#62DAFC"></stop>
                    <stop offset="0.811" stopColor="#0EE094"></stop>
                    <stop offset="1" stopColor="#0EE094"></stop>
                </linearGradient>
                <linearGradient
                    id="paint11_linear_8_418"
                    x1="435.018"
                    x2="-167.817"
                    y1="271.706"
                    y2="-22.19"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6C1DEC"></stop>
                    <stop offset="0.446" stopColor="#62DAFC"></stop>
                    <stop offset="0.811" stopColor="#0EE094"></stop>
                    <stop offset="1" stopColor="#0EE094"></stop>
                </linearGradient>
                <linearGradient
                    id="paint12_linear_8_418"
                    x1="435.018"
                    x2="-167.817"
                    y1="271.706"
                    y2="-22.19"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6C1DEC"></stop>
                    <stop offset="0.446" stopColor="#62DAFC"></stop>
                    <stop offset="0.811" stopColor="#0EE094"></stop>
                    <stop offset="1" stopColor="#0EE094"></stop>
                </linearGradient>
                <linearGradient
                    id="paint13_linear_8_418"
                    x1="435.018"
                    x2="-167.817"
                    y1="271.706"
                    y2="-22.19"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6C1DEC"></stop>
                    <stop offset="0.446" stopColor="#62DAFC"></stop>
                    <stop offset="0.811" stopColor="#0EE094"></stop>
                    <stop offset="1" stopColor="#0EE094"></stop>
                </linearGradient>
                <linearGradient
                    id="paint14_linear_8_418"
                    x1="435.018"
                    x2="-167.817"
                    y1="271.706"
                    y2="-22.19"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6C1DEC"></stop>
                    <stop offset="0.446" stopColor="#62DAFC"></stop>
                    <stop offset="0.811" stopColor="#0EE094"></stop>
                    <stop offset="1" stopColor="#0EE094"></stop>
                </linearGradient>
                <linearGradient
                    id="paint15_linear_8_418"
                    x1="435.018"
                    x2="-167.817"
                    y1="271.706"
                    y2="-22.19"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6C1DEC"></stop>
                    <stop offset="0.446" stopColor="#62DAFC"></stop>
                    <stop offset="0.811" stopColor="#0EE094"></stop>
                    <stop offset="1" stopColor="#0EE094"></stop>
                </linearGradient>
                <linearGradient
                    id="paint16_linear_8_418"
                    x1="435.018"
                    x2="-167.817"
                    y1="271.706"
                    y2="-22.19"
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
