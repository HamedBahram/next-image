'use client'

import {
  CldUploadButton as CldUploadButtonDefault,
  CldUploadButtonProps
} from 'next-cloudinary'

export default function CldUploadButton(props: CldUploadButtonProps) {
  return <CldUploadButtonDefault {...props} />
}
