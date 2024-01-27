import React from 'react'
import { keyframes, css, styled } from 'styled-components'

export type AnimationType = 'shake' | 'spin' | 'flip' | 'none'
type ActionType = 'hover' | 'load'

interface AnimatedIconProps {
  icon: React.ReactNode
  animation: AnimationType
  action: ActionType
}

const shakeAnimation = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-2px);
  }
  50% {
    transform: translateX(2px);
  }
  75% {
    transform: translateX(-2px);
  }
`

const spinAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const flipAnimation = keyframes`
  0% {
    transform: scaleX(1);
  }
  50% {
    transform: scaleX(-1);
  }
  100% {
    transform: scaleX(1);
  }
`

const getAnimation = (animation: AnimationType) => {
  switch (animation) {
    case 'shake':
      return css`
        ${shakeAnimation}
      `
    case 'spin':
      return css`
        ${spinAnimation}
      `
    case 'flip':
      return css`
        ${flipAnimation}
      `
    default:
      return ''
  }
}

const Wrapper = styled.div<{ action: ActionType; animation: AnimationType }>`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ action, animation }) => {
    if (animation === 'none') {
      return ''
    }
    return action === 'hover'
      ? css`
          &:hover {
            animation: ${getAnimation(animation)} 0.5s ease-in-out infinite;
          }
        `
      : css`
          animation: ${getAnimation(animation)} 0.5s ease-in-out infinite;
        `
  }}
`

const AnimatedIcon: React.FC<AnimatedIconProps> = ({ icon, animation, action }) => {
  return (
    <Wrapper action={action} animation={animation}>
      {icon}
    </Wrapper>
  )
}

export default AnimatedIcon
