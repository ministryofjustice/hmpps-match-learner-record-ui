declare module 'prisonApi' {
  export interface ImageDetail {
    imageId: string
    active: boolean
    captureDate: string
    captureDateTime: string
    imageView: string
    imageOrientation: string
    imageType: string
    objectId?: string
  }
}
