import React from 'react'

const TrendingFanArt = ({ trendingArt = [] }) => {
  return (
    <section>
      <div>
        <h2>Trending Fan Art</h2>
        <div>
          <div></div>
        </div>
      </div>
      <div>
        <div>
          <img src={trendingArt[0]?.mediaUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAqTKxsU9mGHerAA9crgcJ9pDHfVc3aphfEXrv_-09yhDn6aUvyeQkfzjz-K1hlbirkBVYv-xBCcmgIGeZcpaQ5DmTEpGB6E2PZ4DXeYSP5iK9EcBmxA-LIUfFC9Crz1vEa-nrMWGHLK-gkUlTMDJE7dspzdXWSNT_MWcceNgs2u1b8BKev2RLuzV1BpMJCt9InFVpgzfJhKPMjeWjBktT0zgN7ophQ-BjuKgcH3It0iqNv7reX3hGUh53XyOVqkDXTnNyo815CSK9u"} />
          <div>
            <p>{trendingArt[0]?.content || "Core Overdrive"}</p>
            <p>by @{trendingArt[0]?.user?.username || "CyberArt_K"}</p>
            <div>
              <span>favorite</span>
              <span>share</span>
            </div>
          </div>
        </div>
        
        <div>
          <img src={trendingArt[1]?.mediaUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBq97rFyyWONTReNiJDj_vXYUJSIaEfZkG0gEyXnRusrTwaAvp5ak1Fhoz05vBTwlmhY6fyOH295-HfzBQQihq_gVVCV0CvKQfqLTMwH1r5ffo9LmtUznFbKYbhAVvo1XwGG97-neeMeVg37nxA7uhf7yTVw13uklAfAUXzFpdPB-KvPsnP2r9cQhjv0Tr8XlM8lLj3K_x-fjYcIXbVs7kkXLzn9GCrSCTvxxZPJCXrVc_6Pk_DF9SJ03uDCIIY1R734-5a3sanvcQ3"} />
          <div></div>
          <div>
            <p>{trendingArt[1]?.content || "Vapor Echo"}</p>
            <p>by @{trendingArt[1]?.user?.username || "NeonDreamer"}</p>
            <div>
              <span>favorite</span>
              <span>share</span>
            </div>
          </div>
        </div>
        
        <div>
          <img src={trendingArt[2]?.mediaUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDwneMQqtwmjrXrXdsfHXH2agreUPDrhrHyITxco3Osl1B--dob3GKwB_7UGn0ZBj3JCYk6iuIeJPafnOEYa1j7PEM83tNIpytkWXJo4X-FOXChIi2nJDLwj5lRohRc93SaOH5NpNObSeKzFgglJp35NvK1BgLo5M6xjpetwIR4Cp6EVFwZMGyCwL1O-PSA7Dhxou8-vr9r0Vfa2-hjsXd8-pITIonb0JjHtnnG5WsT47EqvtyRSrcg68sptUCiLqt6icW03p7xVyWR"} />
          <div>
            <p>{trendingArt[2]?.content || "Spirit Wing"}</p>
            <p>by @{trendingArt[2]?.user?.username || "Luna_Illust"}</p>
            <div>
              <span>favorite</span>
              <span>share</span>
            </div>
          </div>
        </div>
        
        <div>
          <img src={trendingArt[3]?.mediaUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuC9HDZTnIIzTXTNUX6hzL1uEHZImsXGkKCAzHwbv3jGmTgf_40t6yj9NQC3r6S4e5VGMzoUqzB1lroXj7oiXMqD7GH8vh6YSLtydGMP1uG4N3q6UgPXUy49_QBfn3jlcayNktndZVgz8oKsn0fGqFxAsL5Vxd2SMLh-M1umAfeUqLVWnoJia4OI598x95YpKdWKpGpQf2n_NmnjyVeimV8xXMh5vZbxYHqLKLH0qX00je_MzdBDOx_LtkOKLxXtwKwjqRwy5ya4Uq-g"} />
          <div>
            <p>{trendingArt[3]?.content || "City Edge"}</p>
            <p>by @{trendingArt[3]?.user?.username || "Tekno_S"}</p>
            <div>
              <span>favorite</span>
              <span>share</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrendingFanArt
