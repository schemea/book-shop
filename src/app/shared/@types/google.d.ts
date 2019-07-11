declare namespace GoogleAPI {
  interface IndustryIdentifiers {
    type: "ISBN_10" | "ISBN_13" | string,
    identifier: string
  }

  interface VolumeInfo {
    title: string,
    authors: string[],
    publishedDate: string,
    industryIdentifiers: IndustryIdentifiers[],
    readingModes: {
      text: boolean,
      image: boolean
    },
    pageCount: number,
    printType: string,
    categories: string[],
    averageRating: number,
    ratingsCount?: number,
    maturityRating: string,
    allowAnonLogging: boolean,
    contentVersion: string,
    imageLinks: {
      smallThumbnail: string,
      thumbnail: string
    },
    language: string,
    previewLink: string,
    infoLink: string,
    canonicalVolumeLink: string
    description: string
  }

  interface Price {
    amount?: number,
    amountInMicros?: number,
    currencyCode: "EUR" | string
  }

  interface SaleInfoCommon {
    country: string,
    isEbook: boolean,
    buyLink: string
  }

  interface NotForSaleInfo extends SaleInfoCommon {
    saleability: "FREE" | "NOT_FOR_SALE",
  }

  interface ForSaleInfo extends SaleInfoCommon {
    saleability: "FOR_SALE",

    listPrice: Price[]
  }

  type SaleInfo = NotForSaleInfo | ForSaleInfo;

  interface AccessInfo {
    country: string,
    viewability: string,
    embeddable: boolean,
    publicDomain: boolean,
    textToSpeechPermission: string,
    epub: {
      isAvailable: boolean,
      downloadLink: string
    },
    pdf: {
      isAvailable: boolean,
      downloadLink: string
    },
    webReaderLink: string,
    accessViewStatus: string,
    quoteSharingAllowed: boolean
  }

  interface BookInfo {
    kind: string,
    id: string,
    etag: string,
    selfLink: string,
    volumeInfo: VolumeInfo,
    saleInfo: SaleInfo,
    accessInfo: AccessInfo
  }
  interface SearchResponse {
    kind: string,
    totalItems: number,
    items: BookInfo[]
  }
}
