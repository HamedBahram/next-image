'use client'

import { useState } from 'react'
import { ReactCompareSlider } from 'react-compare-slider'

import CldImage from '@/components/CldImage'
import CldUploadButton from '@/components/CldUploadButton'

export default function Home() {
  const [resource, setResource] = useState<string | any>()
  const [restoreLoaded, setRestoreLoaded] = useState(false)
  const [compare, setCompare] = useState(false)

  return (
    <section className='flex h-screen bg-gradient-to-br from-gray-700 to-gray-900 py-24 text-white'>
      <div className='container flex justify-center'>
        <div>
          <h1 className='text-center font-serif text-5xl font-medium'>
            Next Image Transform
          </h1>

          <div className='mt-10 flex justify-center gap-6 text-center'>
            <CldUploadButton
              uploadPreset='friendsbook'
              className='rounded-lg bg-white px-4 py-1 font-medium text-gray-900'
              onClick={() => {
                setResource(undefined)
                setRestoreLoaded(false)
                setCompare(false)
              }}
              onSuccess={(result, { widget }) => {
                setResource(result?.info)
                widget.close()
              }}
            >
              Upload Image
            </CldUploadButton>

            <button
              className='rounded-lg bg-white px-4 py-1 font-medium text-gray-900'
              onClick={() => setCompare(!compare)}
            >
              {compare ? 'Side by Side' : 'Compare'}
            </button>
          </div>

          {resource?.public_id && (
            <div className='mt-10 flex items-center justify-center'>
              {compare ? (
                <ReactCompareSlider
                  itemOne={
                    <CldImage
                      width={400}
                      height={400}
                      src={resource?.public_id}
                      alt=''
                    />
                  }
                  itemTwo={
                    <CldImage
                      width={400}
                      height={400}
                      src={resource?.public_id}
                      improve='indoor:50'
                      restore
                      alt=''
                    />
                  }
                  className='rounded-lg'
                />
              ) : (
                <div className='flex gap-4'>
                  <CldImage
                    width={400}
                    height={400}
                    src={resource?.public_id}
                    alt=''
                    className='rounded-lg'
                  />

                  <div className='relative'>
                    {!restoreLoaded && (
                      <div className='absolute inset-0 flex animate-pulse items-center justify-center rounded-lg bg-white' />
                    )}
                    <CldImage
                      width={400}
                      height={400}
                      src={resource?.public_id}
                      improve='indoor:50'
                      restore
                      alt=''
                      className='rounded-lg'
                      onLoad={() => setRestoreLoaded(true)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
