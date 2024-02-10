import { useEffect, useState } from 'react'
import { IconLookup, IconName, library } from '@fortawesome/fontawesome-svg-core'

export const useFontAwesomeIconPack = () => {
  const [iconPack, setIconPack] = useState<IconLookup[]>()

  useEffect(() => {
    if (!iconPack) {
      import('@fortawesome/free-solid-svg-icons').then((module) => {
        //Delete problematic icons
        const fas = { ...module.fas }
        delete fas.faCookie
        delete fas.faFontAwesomeLogoFull
        console.log(Object.keys(fas).length)

        const uniqueIconsSet = new Set(Object.values(fas).map((icon) => icon.iconName))
        const icons = Array.from(uniqueIconsSet)
          .map((icon) => {
            const matchingIcon = Object.values(fas).find((i) => i.iconName === icon)
            if (matchingIcon) {
              return {
                prefix: matchingIcon.prefix,
                icon: matchingIcon.icon,
                iconName: matchingIcon.iconName as IconName,
              }
            }
          })
          .filter((it) => it)
        // @ts-ignore
        library.add(...icons)
        // @ts-ignore
        setIconPack(icons)
      })
    }
  }, [iconPack])

  return iconPack
}
