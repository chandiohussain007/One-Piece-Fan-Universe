import { useEffect, useState } from 'react'
import api from '../services/api'
import Hero from '../components/Hero'
import RecentChapters from '../components/RecentChapters'
import TrendingFanArt from '../components/TrendingFanArt'
import CallToAction from '../components/CallToAction'
import Footer from '../components/Footer'

const LandingPage = () => {
  const [latestChapters, setLatestChapters] = useState([])
  const [trendingArt, setTrendingArt] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chaptersRes, artRes] = await Promise.all([
          api.get('/manga'),
          api.get('/fanart/trending')
        ])
        setLatestChapters(chaptersRes.data.slice(0, 4))
        setTrendingArt(artRes.data.slice(0, 4))
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <Hero />
      <RecentChapters latestChapters={latestChapters} />
      <TrendingFanArt trendingArt={trendingArt} />
      <CallToAction />
      <Footer />
    </>
  )
}

export default LandingPage