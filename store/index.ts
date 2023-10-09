export const fetchStoreData = ()=>{
  //fetch(url).then(
  //  res => {data=res}
  //)
  //
  //Replace dummy data with fetch data 
  let data = {
  "rows": [
    {
      "id": 1,
      "name": "Tokopedia",
      "shops": [
        {
          "id": 5,
          "watch_it_channel_id": 1,
          "link_shop": "https://www.tokopedia.com/miraioff/"
        },
        {
          "id": 4,
          "watch_it_channel_id": 1,
          "link_shop": "https://www.tokopedia.com/danpac-pharma/"
        },
        {
          "id": 3,
          "watch_it_channel_id": 1,
          "link_shop": "https://www.tokopedia.com/durexstore/"
        },
        {
          "id": 2,
          "watch_it_channel_id": 1,
          "link_shop": "https://www.tokopedia.com/retela-1/"
        },
        {
          "id": 1,
          "watch_it_channel_id": 1,
          "link_shop": "https://www.tokopedia.com/sutrafiesta"
        }
      ]
    }
  ]
}
  return data.rows[0].shops
}

export const fetchQueryData = ()=>{
  //fetch(url).then(
  //  res => {data=res}
  //)
  //Replace dummy data with fetch data 
  let data = {
  "rows": [
    {
      "id": 3,
      "name": "xiaomi redmi note 9"
    }
  ]
}
  return data.rows
}

export const fetchProductData = ()=>{
  //fetch(url).then(
  //  res => {data=res}
  //)
  //Replace dummy data with fetch data 
  let data = {
  "rows": [
    {
      "id": 1,
      "link": "https://www.tokopedia.com/durexstore/durex-performa-3s-kondom-tahan-lama-pria"
    },
    {
      "id": 2,
      "link": "https://www.tokopedia.com/miraioff/kondom-mirai-big-dots-3-pcs-tekstur-berbintik-lebih-besar-dan-lebar"
    },
    {
      "id": 3,
      "link": "https://www.tokopedia.com/danpac-pharma/kondom-sensitif-vivo-extra-sensation"
    },
    {
      "id": 4,
      "link": "https://www.tokopedia.com/intimedikabdg/sensitif-vivo-kondom-tipis-premium-delay-tahan-lama-isi-3-fruity-affair"
    },
    {
      "id": 5,
      "link": "https://www.tokopedia.com/retela-1/kondom-okamoto-crown-10-s"
    }
  ]
}
  return data.rows
}
