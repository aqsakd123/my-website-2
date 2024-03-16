import React, { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'

const MarqueeContainer = styled.div`
  width: 450px;
  margin: 0 auto;
  overflow: hidden;
  box-sizing: border-box;
`

const MarqueeAnimation = keyframes`
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-100%, 0);
  }
`

const MarqueeSpan = styled.span<{ shouldAnimate: boolean }>`
  display: inline-block;
  width: max-content;
  will-change: transform;
  animation: ${MarqueeAnimation} 5s linear infinite;
  animation-play-state: ${({ shouldAnimate }) => (!shouldAnimate ? `paused;` : '')};

  &:hover {
    animation-play-state: paused;
  }
`

const RollingContainer = styled.div`
  overflow: hidden;
`

type Props = {
  width?: string
  className?: string
  children: React.ReactNode
}

const MarqueeBox: React.FC<Props> = (props: Props) => {
  const { width = '100px', children, className } = props

  const marqueeSpanRef = useRef<HTMLSpanElement>(null)
  const [shouldAnimate, setShouldAnimate] = useState(false)

  useEffect(() => {
    const spanWidth = marqueeSpanRef.current?.offsetWidth || 0
    const containerWidth = parseInt(width, 10) || 0
    setShouldAnimate(spanWidth > containerWidth)
    console.log(spanWidth, containerWidth)
  }, [])

  return (
    <RollingContainer className={className} style={{ width }}>
      <MarqueeContainer>
        <MarqueeSpan ref={marqueeSpanRef} shouldAnimate={shouldAnimate}>
          {children}
        </MarqueeSpan>
      </MarqueeContainer>
    </RollingContainer>
  )
}

export default MarqueeBox
