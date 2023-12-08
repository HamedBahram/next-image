'use client'

import { CldImage as CldImageDefault, CldImageProps } from 'next-cloudinary'

type Props = CldImageProps & {
  improve?: string
  background?: string
}

export default function CldImage(props: Props) {
  return <CldImageDefault {...props} />
}
