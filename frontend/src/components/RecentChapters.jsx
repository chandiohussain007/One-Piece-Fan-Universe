import React from 'react'
import { Link } from 'react-router-dom'

const RecentChapters = ({ latestChapters = [] }) => {
  return (
    <section>
      <div>
        <div>
           <h2>Latest Chapters</h2>
           <p>Hand-picked releases from the most anticipated series.</p>
        </div>
        <Link to="/manga">
           View All Releases <span>arrow_forward</span>
        </Link>
      </div>
      
      <div>
        <Link to={latestChapters[0] ? `/manga/${latestChapters[0]._id}` : '#'}>
          <img src={latestChapters[0]?.coverImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuAgMj3t2ICkRWKmEs80gunKrhiCWKDjhKM_c-WFpAItQ4ISXBQ5ImpxQWaBZiMxn9grPVRXvdKCkdwFDYUj5hTlY1XN75dTX0R4D6J066TpMigblxxB318HabUbtG8G0H4tq8wCOabWhNd8Mr0ipRnhxFOF35CK9navd0RiSHf-mmmjyLMm-hSuNFUOmu2wkUGfIZrSLYBesR9iriN20zI3psII841gAIrz4WjbJO-fptlbbonDzB2ga5PiGySlNoMGmcgtfrSvaIb_"} />
          <div></div>
          <div>
            <span>Trending Now</span>
            <h3>{latestChapters[0]?.title || "Ghost in the Mesh"}</h3>
            <p>{latestChapters[0]?.description || "Chapter 142: The digital soul resonance begins."}</p>
          </div>
        </Link>
        
        <Link to={latestChapters[1] ? `/manga/${latestChapters[1]._id}` : '#'}>
          <div>
            <img src={latestChapters[1]?.coverImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuCuMa0v8vcR_QaRvmU_TJ38Um6XYj42i4jKdzf-vrxCcqRAAp9LLC2oi9uaXBg-AJJyEOVeKBddauC4_ITGspKQieN2WtHxoCs9YQ7cWSg6WAoMUOpZlrVef4VFBU0LW4ND6iOEexOc178YlMiA71U67WhFLhaElvEvWgrKY4VZZhrZ0NAcxrOR5ss42YWVdB-FQSJROf-DOu_AegiYFJDdUUq2sBM6LQqTnIygE2fcnl-9725cZCPg_x1Irp42t30NaJgou9traG_F"} />
          </div>
          <div>
            <h4>{latestChapters[1]?.title || "Shadow Bound"}</h4>
            <p>Chapter {latestChapters[1]?.order || '24'} • Updated</p>
            <p>{latestChapters[1]?.description || "The warriors gather at the edge of the abyss for the final stand."}</p>
          </div>
        </Link>
        
        <Link to={latestChapters[2] ? `/manga/${latestChapters[2]._id}` : '#'}>
          <div>
            <img src={latestChapters[2]?.coverImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuDl6trehxI4EYpYLkWMMAM_NB99QmrqkseUw-AcGhyK_PuLX7Mxr-onJaN2z49tVaUwmVGyskWy-Nxj1vRcmeGEZPxmjdctO4V_C_ilJkW5tN2zYKyIhgLrj-UNCQqy3BHLQkbbSCSPUa4flsgjW_tWCGvh5czzbI_vSL11UqhHgPLFEWgkitnydf_grYmOzY1tlAbraC1FiXAGwkH6Hn6GZclhuvENIQoBWw2SEZLejkOoIn9su85p9G0tGoWE4Cuxwdih8UCdvRsM"} />
          </div>
          <h4>{latestChapters[2]?.title || "Prism Gate"}</h4>
          <p>New Release</p>
          <div>
            <span>Read Free</span>
            <span>bookmark</span>
          </div>
        </Link>
        
        <Link to={latestChapters[3] ? `/manga/${latestChapters[3]._id}` : '#'}>
          <div>
            <img src={latestChapters[3]?.coverImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuAlM4Yk6BooOhkZxDGPtW6mjvm_9bno046JXTz0TV8bmEwbV1vAfuwxCA9xLfGmNqDFX4c19oY7Uxq8Ctkyq19TPn8zMh9R7T0ypNkwQQwL0uzyhntfQbajsv-wlmyb-nZd-cZYb6cyyx7DGbpjUu3-7UJdRAlVxfmWcIMH1wMflx9uzOIucSPSlv0RIOoVV4u9Z0LUenVseDvlkKGjVpJTSLjdgjvMePf4gpo0mSCVvLi42WVWcR2tcRqddGk9vqaTbSlrl0cjF5Uf"} />
          </div>
          <h4>{latestChapters[3]?.title || "Cloud Walker"}</h4>
          <p>Weekly Top</p>
          <div>
            <span>Pre-order</span>
            <span>bookmark</span>
          </div>
        </Link>
      </div>
    </section>
  )
}

export default RecentChapters
