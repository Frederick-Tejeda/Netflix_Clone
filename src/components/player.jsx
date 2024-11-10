import { useState, useEffect } from "react"

export default function Player ({url}){

    const [final_movie, setFinal_movie] = useState({})
    const [new_url, setNew_url] = useState("")
    const [message, setMessage] = useState("Loading...")

    let index_of_params = url.indexOf('?')
    let url_with_params = url.substring(index_of_params + 1)
    let params = url_with_params.split("&")
    let dic_of_params = {title: "", release_year: "", isMovie: ""}
    params.forEach((param) => {
      let [key, value] = param.split('=')
      dic_of_params[key] = value
    })
    let [title, release_year, isMovie] = [decodeURIComponent(dic_of_params['title']), dic_of_params['release_date'].split('-')[0], dic_of_params['isMovie'].split('-')[0]]
    let url_to_fetch = new URL(`https://movies-tv-shows-database.p.rapidapi.com/?title=${title}`)

    isMovie = (isMovie == 'true') ? true : false

    const MediaNoFound = () => {
      console.log('Media no Found')
      setMessage('Media no Found')
    }

  const LookForMovie = async (movie_results) => {
    console.log({title, release_year})
    movie_results = movie_results.filter((e) => e?.title == title && e?.year == release_year)
    console.log({movie_results})
    const results = []
      movie_results.forEach(async element => {
        const url = `https://imdb188.p.rapidapi.com/api/v1/searchIMDB?query=${element.imdb_id}`;
        const options = {
          method: 'GET',
          headers: {
            'x-rapidapi-key': 'f926bd8046msh8fc4f7d8a15079fp1abd39jsndcb95e31d843',
            'x-rapidapi-host': 'imdb188.p.rapidapi.com'
          }
        };
        try {
          const response = await fetch(url, options);
          const result = await response.json();
          console.log({result})
          if(result.data !== undefined){
            console.log('here')
            const data_result = await result.data.filter((e) => e?.year == release_year && e?.title == title)[0]
            setFinal_movie(data_result)
            console.log({new_url})
          }
        } catch (error) {
          console.error(error);
        }
      });
  }

  const GetMovieInfo = async () => {
    let movie_results = []
    try{
      const options = isMovie ? {
        method: 'GET',
        headers: {
          'x-rapidapi-key': 'f926bd8046msh8fc4f7d8a15079fp1abd39jsndcb95e31d843',
          'x-rapidapi-host': 'movies-tv-shows-database.p.rapidapi.com',
          Type: 'get-movies-by-title'
        }
      } : {
        method: 'GET',
        headers: {
          'x-rapidapi-key': 'f926bd8046msh8fc4f7d8a15079fp1abd39jsndcb95e31d843',
          'x-rapidapi-host': 'movies-tv-shows-database.p.rapidapi.com',
          Type: 'get-shows-by-title'
        }
      }
      const response = await fetch(url_to_fetch, options);
      const result = await response.json();
      if(isMovie == true){
        console.log('movie')
        movie_results = result.movie_results
      }else{
        console.log('show')
        movie_results = result.tv_results
      }
      console.log({isMovie})
      console.log({result})
      console.log({movie_results })
      if(!movie_results){
        MediaNoFound()
        return
      }
      
      console.log({movie_results})
      const low_title = title.toLocaleLowerCase()
      console.log({low_title})
      await movie_results.forEach((a) => {
        console.log({title: a['title'].toLocaleLowerCase() == low_title, year: a[(isMovie == true) ? 'year' : 'release_date'] == release_year});
        
        if(isMovie == true){
          if(a['title'].toLocaleLowerCase() == low_title && a['year'] == release_year){
            setFinal_movie(a)
            console.log({new_url})
          }
        }else{
          if(a['title'].toLocaleLowerCase() == low_title && a['release_date'].split('-')[0] == release_year){
            setFinal_movie(a)
            console.log({new_url})
          }
        }
      })
       console.log({final_movie})
      if(movie_results.length < 1){
        catch_error = true
      }else if(movie_results.length > 1){
        LookForMovie(movie_results)
      }
    }catch(err){
      catch_error = err
      console.log('Error', err)
    }
  }

  const Iframe = () => {
    return(
        <iframe src={new_url} allowFullScreen autoPlay></iframe>
    )
  }
  
  useEffect(() => {
    GetMovieInfo()
  }, [])
  
  useEffect(() => {
    if (final_movie != undefined) setNew_url((isMovie == true) ? `https://vidsrc.cc/v2/embed/movie/${final_movie?.imdb_id}?autoPlay=true`: `https://vidsrc.cc/v2/embed/tv/${final_movie?.imdb_id}/1/1`)
    console.log({final_movie})
  }, [final_movie])

    return(
      <div>
          {(final_movie.id || final_movie.imdb_id) ? ( <Iframe /> ) : ( <h1>{message}</h1> )} 
      </div>
    )
}
