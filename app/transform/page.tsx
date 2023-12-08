'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Fragment, useRef, useState } from 'react'
import { ReactCompareSlider } from 'react-compare-slider'

import { Dialog, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

import CldUploadButton from '@/components/CldUploadButton'
import CldImage from '@/components/CldImage'
import { getCldImageUrl } from 'next-cloudinary'

const initialTransformations = {
  restore: false,
  removeBackground: false,
  background: ''
}

export default function Example() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [compare, setCompare] = useState(false)
  const backgroundColorRef = useRef<HTMLInputElement>(null)

  const [resource, setResource] = useState<string | any>()
  const [transformedImageLoaded, setTransformedImageLoaded] = useState(false)
  const [transformations, setTransformations] = useState<string | any>(
    initialTransformations
  )

  const transformationsActive = Object.values(transformations).some(Boolean)

  const handleDownload = async () => {
    const url = getCldImageUrl({
      src: resource?.public_id,
      width: resource?.width,
      height: resource?.height,
      ...(transformations.restore
        ? { restore: true, improve: 'indoor:50' }
        : {}),
      ...(transformations.removeBackground
        ? { removeBackground: true, background: 'white' }
        : {}),
      ...(transformations.background
        ? {
            removeBackground: true,
            background: `rgb:${transformations.background}`
          }
        : {})
    })

    const res = await fetch(url)
    const blob = await res.blob()
    const href = URL.createObjectURL(blob)

    const link = Object.assign(document.createElement('a'), {
      href,
      style: { display: 'none' },
      download: 'image'
    })

    document.body.appendChild(link)
    link.click()
    URL.revokeObjectURL(href)
    link.remove()
  }

  return (
    <div>
      {/* Mobile menu slider */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-50 lg:hidden'
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter='transition-opacity ease-linear duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='transition-opacity ease-linear duration-300'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-gray-900/80' />
          </Transition.Child>

          <div className='fixed inset-0 flex'>
            <Transition.Child
              as={Fragment}
              enter='transition ease-in-out duration-300 transform'
              enterFrom='-translate-x-full'
              enterTo='translate-x-0'
              leave='transition ease-in-out duration-300 transform'
              leaveFrom='translate-x-0'
              leaveTo='-translate-x-full'
            >
              <Dialog.Panel className='relative mr-16 flex w-full max-w-xs flex-1'>
                <Transition.Child
                  as={Fragment}
                  enter='ease-in-out duration-300'
                  enterFrom='opacity-0'
                  enterTo='opacity-100'
                  leave='ease-in-out duration-300'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <div className='absolute left-full top-0 flex w-16 justify-center pt-5'>
                    <button
                      type='button'
                      className='-m-2.5 p-2.5'
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className='sr-only'>Close sidebar</span>
                      <XMarkIcon
                        className='h-6 w-6 text-white'
                        aria-hidden='true'
                      />
                    </button>
                  </div>
                </Transition.Child>
                {/* Mobile sidebar */}
                <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10'>
                  <div className='flex h-16 shrink-0 items-center'>
                    <Link href='/'>
                      <h1 className='font-bold uppercase tracking-wide text-white'>
                        image.xi
                      </h1>
                    </Link>
                  </div>
                  <nav className='flex flex-1 flex-col'>
                    <ul
                      role='list'
                      className='flex flex-1 flex-col gap-y-10 text-white'
                    >
                      <li>
                        <h3 className='mb-3 text-gray-400'>Select</h3>
                        <CldUploadButton
                          uploadPreset='friendsbook'
                          className='rounded-lg bg-white px-3 py-1 text-sm font-medium text-gray-900'
                          onClick={() => {
                            setResource(undefined)
                            setTransformedImageLoaded(false)
                            setTransformations(initialTransformations)
                            setCompare(false)
                          }}
                          onSuccess={(result, { widget }) => {
                            setResource(result?.info)
                            widget.close()
                          }}
                        >
                          Upload Image
                        </CldUploadButton>
                      </li>

                      <li>
                        <h3 className='mb-3 text-gray-400'>Transform</h3>
                        <ul className='flex flex-col gap-y-3'>
                          <li>
                            <button
                              className='rounded-lg border border-gray-500 px-3 py-1 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-25'
                              disabled={!resource?.public_id}
                              onClick={() => {
                                setTransformations({
                                  ...initialTransformations,
                                  restore: true
                                })
                                setTransformedImageLoaded(false)
                              }}
                            >
                              Restore
                            </button>
                          </li>
                          <li>
                            <button
                              className='rounded-lg border border-gray-500 px-3 py-1 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-25'
                              disabled={!resource?.public_id}
                              onClick={() => {
                                setTransformations({
                                  ...initialTransformations,
                                  removeBackground: true
                                })
                                setTransformedImageLoaded(false)
                              }}
                            >
                              Remove Background
                            </button>
                          </li>
                          <li className='flex'>
                            <button
                              disabled={!resource?.public_id}
                              className='cursor-pointer rounded-lg border border-gray-500 px-3 py-1 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-25'
                              onClick={() =>
                                backgroundColorRef.current?.click()
                              }
                            >
                              Background Color
                            </button>
                            <input
                              ref={backgroundColorRef}
                              type='color'
                              className='h-0 w-0 opacity-0'
                              disabled={!resource?.public_id}
                              onChange={e => {
                                setTransformations({
                                  ...initialTransformations,
                                  removeBackground: true,
                                  background: e.target.value.slice(1)
                                })
                                setTransformedImageLoaded(false)
                              }}
                            />
                          </li>
                        </ul>
                      </li>

                      <li>
                        <h3 className='mb-3 text-gray-400'>Download</h3>
                        <button
                          className='rounded-lg bg-white px-3 py-1 text-sm font-medium text-gray-900'
                          onClick={handleDownload}
                        >
                          Download Image
                        </button>
                      </li>

                      {/* User avatar */}
                      <li className='-mx-6 mt-auto'>
                        <a
                          href='#'
                          className='flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800'
                        >
                          <Image
                            width={32}
                            height={32}
                            className='h-8 w-8 rounded-full bg-gray-800'
                            src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                            alt=''
                          />
                          <span className='sr-only'>Your profile</span>
                          <span aria-hidden='true'>Tom Cook</span>
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop */}
      <div className='hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col'>
        {/* Sidebar component */}
        <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6'>
          <div className='flex h-16 shrink-0 items-center'>
            <Link href='/'>
              <h1 className='font-bold uppercase tracking-wide text-white'>
                image.xi
              </h1>
            </Link>
          </div>
          <nav className='flex flex-1 flex-col'>
            <ul
              role='list'
              className='flex flex-1 flex-col gap-y-10 text-white'
            >
              <li>
                <h3 className='mb-3 text-gray-400'>Select</h3>
                <CldUploadButton
                  uploadPreset='friendsbook'
                  className='rounded-lg bg-white px-3 py-1 text-sm font-medium text-gray-900'
                  onClick={() => {
                    setResource(undefined)
                    setTransformedImageLoaded(false)
                    setTransformations(initialTransformations)
                    setCompare(false)
                  }}
                  onSuccess={(result, { widget }) => {
                    setResource(result?.info)
                    widget.close()
                  }}
                >
                  Upload Image
                </CldUploadButton>
              </li>

              <li>
                <h3 className='mb-3 text-gray-400'>Transform</h3>
                <ul className='flex flex-col gap-y-3'>
                  <li>
                    <button
                      className='rounded-lg border border-gray-500 px-3 py-1 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-25'
                      disabled={!resource?.public_id}
                      onClick={() => {
                        setTransformations({
                          ...initialTransformations,
                          restore: true
                        })
                        setTransformedImageLoaded(false)
                      }}
                    >
                      Restore
                    </button>
                  </li>
                  <li>
                    <button
                      className='rounded-lg border border-gray-500 px-3 py-1 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-25'
                      disabled={!resource?.public_id}
                      onClick={() => {
                        setTransformations({
                          ...initialTransformations,
                          removeBackground: true
                        })
                        setTransformedImageLoaded(false)
                      }}
                    >
                      Remove Background
                    </button>
                  </li>
                  <li className='flex'>
                    <button
                      disabled={!resource?.public_id}
                      className='cursor-pointer rounded-lg border border-gray-500 px-3 py-1 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-25'
                      onClick={() => backgroundColorRef.current?.click()}
                    >
                      Background Color
                    </button>
                    <input
                      ref={backgroundColorRef}
                      type='color'
                      className='h-0 w-0 opacity-0'
                      disabled={!resource?.public_id}
                      onChange={e => {
                        setTransformations({
                          ...initialTransformations,
                          removeBackground: true,
                          background: e.target.value.slice(1)
                        })
                        setTransformedImageLoaded(false)
                      }}
                    />
                  </li>
                </ul>
              </li>

              <li>
                <h3 className='mb-3 text-gray-400'>Download</h3>
                <button
                  className='rounded-lg bg-white px-3 py-1 text-sm font-medium text-gray-900'
                  onClick={handleDownload}
                >
                  Download Image
                </button>
              </li>

              {/* User avatar */}
              <li className='-mx-6 mt-auto'>
                <a
                  href='#'
                  className='flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800'
                >
                  <Image
                    width={32}
                    height={32}
                    className='h-8 w-8 rounded-full bg-gray-800'
                    src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                    alt=''
                  />
                  <span className='sr-only'>Your profile</span>
                  <span aria-hidden='true'>Tom Cook</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile header */}
      <div className='sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden'>
        <button
          type='button'
          className='-m-2.5 p-2.5 text-gray-400 lg:hidden'
          onClick={() => setSidebarOpen(true)}
        >
          <span className='sr-only'>Open sidebar</span>
          <Bars3Icon className='h-6 w-6' aria-hidden='true' />
        </button>
        <div className='flex flex-1 items-center justify-center text-sm font-semibold leading-6 text-white'>
          <Link href='/'>
            <h1 className='font-bold uppercase tracking-wide text-white'>
              image.xi
            </h1>
          </Link>
        </div>
        <a href='#'>
          <span className='sr-only'>Your profile</span>
          <Image
            width={32}
            height={32}
            className='h-8 w-8 rounded-full bg-gray-800'
            src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
            alt=''
          />
        </a>
      </div>

      {/* Main content */}
      <main className='py-10 lg:pl-72'>
        <div className='px-4 sm:px-6 lg:px-8'>
          {/* Controls */}
          <div className='mb-10 flex items-center justify-center'>
            <button
              className='rounded-lg bg-gray-900 px-3 py-1 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50'
              disabled={
                !resource?.public_id ||
                !transformationsActive ||
                !transformedImageLoaded
              }
              onClick={() => setCompare(!compare)}
            >
              {compare ? 'Side by Side' : 'Slider'}
            </button>
          </div>

          {resource?.public_id && !transformationsActive && (
            <div className='flex items-center justify-center'>
              <CldImage
                alt=''
                width={400}
                height={400}
                className='rounded-lg'
                src={resource?.public_id}
              />
            </div>
          )}

          {resource?.public_id && transformationsActive && (
            <div className='flex items-center justify-center'>
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
                      alt=''
                      width={400}
                      height={400}
                      className='rounded-lg'
                      src={resource?.public_id}
                      onLoad={() => setTransformedImageLoaded(true)}
                      {...(transformations.restore
                        ? { restore: true, improve: 'indoor:50' }
                        : {})}
                      {...(transformations.removeBackground
                        ? { removeBackground: true, background: 'white' }
                        : {})}
                      {...(transformations.background
                        ? {
                            removeBackground: true,
                            background: `rgb:${transformations.background}`
                          }
                        : {})}
                    />
                  }
                  className='rounded-lg ring-1 ring-gray-200'
                />
              ) : (
                <div className='flex gap-4'>
                  <CldImage
                    alt=''
                    width={400}
                    height={400}
                    className='rounded-lg'
                    src={resource?.public_id}
                  />

                  <div className='relative'>
                    {!transformedImageLoaded && (
                      <div className='absolute inset-0 flex items-center justify-center rounded-lg bg-gray-400'>
                        <svg
                          className='-ml-1 mr-3 h-12 w-12 animate-spin text-white'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                        >
                          <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='3'
                          />
                          <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
                          />
                        </svg>
                      </div>
                    )}
                    <CldImage
                      alt=''
                      width={400}
                      height={400}
                      className='rounded-lg'
                      src={resource?.public_id}
                      onLoad={() => setTransformedImageLoaded(true)}
                      {...(transformations.restore
                        ? { restore: true, improve: 'indoor:50' }
                        : {})}
                      {...(transformations.removeBackground
                        ? { removeBackground: true }
                        : {})}
                      {...(transformations.background
                        ? {
                            removeBackground: true,
                            background: `rgb:${transformations.background}`
                          }
                        : {})}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
