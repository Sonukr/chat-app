import React from 'react'


const  Loader = ({title})  => {
  return (
    <div className='loader'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 100 100'
          preserveAspectRatio='xMidYMid'
          width={200}
          height={200}
          style={{
            shapeRendering: "auto",
            display: "block",
            background: "rgba(255, 255, 255, 0)",
          }}
          xmlnsXlink='http://www.w3.org/1999/xlink'

        >
          <g>
            <circle
              cx={50}
              cy={50}
              r={32}
              strokeWidth={8}
              stroke='#fe718d'
              strokeDasharray='50.26548245743669 50.26548245743669'
              fill='none'
              strokeLinecap='round'
            >
              <animateTransform
                attributeName='transform'
                type='rotate'
                repeatCount='indefinite'
                dur='1s'
                keyTimes='0;1'
                values='0 50 50;360 50 50'
              />
            </circle>
            <g />
          </g>
        </svg>
        {title && <p>{title}</p>}
      </div>
  )
}


export default Loader;