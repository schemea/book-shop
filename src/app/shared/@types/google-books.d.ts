declare namespace GoogleAPI {

  type datetime = string;

  interface ThumbnailMap {
    smallThumbnail: string,
    thumbnail: string,
    small?: string,
    medium?: string,
    large?: string,
    extraLarge?: string
  }

  interface Price {
    amount: number,
    currencyCode: string
  }
  type Saleability = "FOR_SALE" | "FREE" | "NOT_FOR_SALE";
  interface VolumeResource {
    kind: "books#volume",
    id: string,
    etag: string,
    selfLink: string,
    volumeInfo: {
      title: string,
      subtitle: string,
      authors: string[],
      publisher: string,
      publishedDate: string,
      description: string,
      industryIdentifiers: {
        type: string,
        identifier: string
      }[],
      pageCount: number,
      dimensions: {
        height: string,
        width: string,
        thickness: string
      },
      printType: string,
      mainCategory: string,
      categories: string[],
      averageRating: number,
      ratingsCount: number,
      contentVersion: string,
      imageLinks: ThumbnailMap,
      language: string,
      previewLink: string,
      infoLink: string,
      canonicalVolumeLink: string
    },
    // userInfo: {
    //   review: mylibrary.reviews Resource,
    //   readingPosition: mylibrary.readingpositions Resource,
    //   isPurchased: boolean,
    //   isPreordered: boolean,
    //   updated: datetime
    // },
    saleInfo: {
      country: string,
      saleability: Saleability,
      onSaleDate: datetime,
      isEbook: boolean,
      listPrice?: Price,
      retailPrice?: Price,
      buyLink: string
    },
    accessInfo: {
      country: string,
      viewability: string,
      embeddable: boolean,
      publicDomain: boolean,
      textToSpeechPermission: string,
      epub: {
        isAvailable: boolean,
        downloadLink: string,
        acsTokenLink: string
      },
      pdf: {
        isAvailable: boolean,
        downloadLink: string,
        acsTokenLink: string
      },
      webReaderLink: string,
      accessViewStatus: string,
      downloadAccess: {
        kind: "books#downloadAccessRestriction",
        volumeId: string,
        restricted: boolean,
        deviceAllowed: boolean,
        justAcquired: boolean,
        maxDownloadDevices: number,
        downloadsAcquired: number,
        nonce: string,
        source: string,
        reasonCode: string,
        message: string,
        signature: string
      }
    },
    searchInfo: {
      textSnippet: string
    }
  }
  interface VolumesList {
    kind: "books#volumes",
    items: VolumeResource[],
    totalItems: number
  }
}
