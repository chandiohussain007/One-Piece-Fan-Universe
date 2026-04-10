import { useEffect, useState } from 'react'
import api from '../services/api'
import Hero from '../components/Hero'
import RecentChapters from '../components/RecentChapters'
import TrendingFanArt from '../components/TrendingFanArt'
import CallToAction from '../components/CallToAction'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

const LandingPage = () => {
  const [latestChapters, setLatestChapters] = useState([])
  const [trendingArt, setTrendingArt] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chaptersRes, artRes] = await Promise.all([
          api.get('/manga?category=Manga&limit=5'),
          api.get('/fanart/trending')
        ])
        setLatestChapters((chaptersRes.data.chapters || []).slice(0, 4))
        setTrendingArt(artRes.data.slice(0, 4))
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <SEO 
        title="Home"
        description="Immerse yourself in epic storytelling, powerful characters, and a universe driven by dreams, freedom, and adventure. Best One Piece Fandom."
        keywords="One Piece Home, Anime, Fandom Universe"
      />
      <Hero latestChapters={latestChapters} />
      <RecentChapters latestChapters={latestChapters} />
      <TrendingFanArt trendingArt={trendingArt} />
      <CallToAction />
      <Footer />
    </>
  )
}

export default LandingPage