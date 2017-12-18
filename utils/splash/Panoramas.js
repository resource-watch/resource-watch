export const PANORAMAS = [
  {
    name: 'coral',
    default: 'bleached',
    backgroundSound: 'https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/sounds/CoralBleachBackgroundSound.mp3',
    options: [
      {
        name: 'healthy',
        label: 'Healthy',
        image: 'https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/images/healthy-optimized.jpg',
        markup: ''
      },
      {
        name: 'bleached',
        label: 'Bleached',
        image: 'https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/images/bleached-optimized.jpg',
        intro: <p>What might resemble a beautiful snowfall is actually a destructive stress response known as coral bleaching, which occurred in Airport Reef in 2015. Prolonged exposure to warmer ocean temperatures can cause corals to expel their symbiotic algae (which gives color to corals and nourishes them through photosynthesis), leaving the corals’ white skeletons visible. Some corals are able to bounce back from a bleaching event if water temperatures decrease fast enough. In a warming ocean, however, <a href="https://www.coralcoe.org.au/media-releases/two-thirds-of-great-barrier-reef-hit-by-back-to-back-mass-coral-bleaching" target="_blank">corals will have less time to recover</a> between bleaching events, and widespread die-off could occur.\nPhoto date: February 2, 2015</p>,
        hotspots: [
          {
            title: 'Coral bleaching on the rise',
            id: 'coral_bleaching_on_the_rise',
            position: '0 2 -12',
            rotation: "0 0 0",
            markup:
              <div>
                <p>
                  Since the 1980s, warmer ocean temperatures have contributed to more frequent and more harmful coral bleaching events around the world. From 1980 to 1997, some 370 incidents of coral bleaching and disease were reported. From 1998 to 2010, that number exploded to more than 3,700. (This jump mostly reflects the destructive effect of rising ocean temperatures, though it should be noted that growing awareness, monitoring, and communication of coral bleaching as an issue also played a role.)
                </p>
                <p>
                  The spike in 1998, which represents the first global coral bleaching event, was abnormally high; but, as the graph shows, the frequency and severity of coral bleaching events dramatically increased in the following years as well.
                </p>
                <iframe src="https://staging.resourcewatch.org/embed/widget/a47df7b0-0cdb-4fc2-a877-7c4324c1d6fa" width="100%" height="474" frameBorder="0"></iframe>
                <h3>
                  What happened in 2002 and 2005?
                </h3>
                <p>
                  Warm ocean temperatures in 2002 caused widespread bleaching, hitting the area around the Great Barrier Reef the hardest. <a href="https://link.springer.com/article/10.1007/s00338-003-0353-y" target="_blank">More than half</a> of the Great Barrier Reef’s corals bleached that year.
                </p>
                <p>
                  Another spike in 2005 was attributed to an underwater heat wave in the Caribbean, leaving <a href="https://www.coris.noaa.gov/activities/caribbean_rpt/SCRBH2005_rpt.pdf" target="_blank">up to 40 percent</a> of reefs bleached there.
                </p>
                <h3>
                  Global coral bleaching events
                </h3>
                <ul>
                  <li><strong>First Event (1998):</strong> In 1997, an unusually strong El Niño followed by a La Niña dramatically changed global ocean surface temperatures. Exacerbated by the general effects of global warming, these temperature changes led to the first mass coral bleaching in 1998. An estimated 16 percent of coral died in 1998 alone.</li>
                  <li><strong>Second Event (2010):</strong> 2010 set a new record for the hottest year, surpassing 1998. Warm ocean temperatures and a moderate El Niño caused another global bleaching event, affecting reefs in every ocean basin.</li>
                  <li><strong>Third Event (2014-2017):</strong> This has been the longest and most widespread global coral bleaching event to date. From 2014 to 2017, coral reefs around the world experienced higher-than-normal ocean temperatures, fueled by a partial <a href="https://coralreefwatch.noaa.gov/satellite/analyses_guidance/global_coral_bleaching_2014-17_status.php" target="_blank">El Niño in 2014-15</a> and worsened by a strong El Niño and a La Niña in the following years. Reefs in American Samoa (the location of Airport Reef, seen here) and the Great Barrier Reef were heavily affected in 2015 and again in early 2017, leaving the <a href="http://www.noaa.gov/media-release/us-coral-reefs-facing-warming-waters-increased-bleaching" target="_blank">majority of coral</a> bleached.</li>
                </ul>
              </div>,
            image: '../../static/images/splash/coral_bleaching_on_the_rise.png',
            imageSelected: '../../static/images/splash/coral_bleaching_on_the_rise_active.png'
          },
          {
            title: 'Coral bleaching up close',
            id: 'coral_bleaching_up_close',
            position: '0 2 16',
            rotation: "0 180 0",
            markup: <div>
              <iframe width="560" height="315" src="https://www.youtube.com/embed/bFdPmiwZzVE?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>
              <p>
                When researchers at the <a href="https://www.qut.edu.au/news/news?news-id=108238" target="_blank">Queensland University of Technology in Australia</a> put corals in tanks and turned up the heat by several degrees, the corals began violently spewing out the algae Symbiodinium in a matter of hours. It’s essentially coral bleaching on fast-forward. The university captured the process in this time-lapse video.
              </p>
              <p>
                Normally symbiotic, Symbiodinium actually <a href="https://news.nationalgeographic.com/2016/08/coral-bleaching-video-algae-warming-oceans-environment-science/" target="_blank">becomes toxic to corals</a> at higher temperatures; the process on display in this video (called pulsed inflation) is a defense mechanism. It may protect them in the short term, but corals need this algae to recolonize quickly, because they rely on the sugar the algae produce for nourishment. If temperatures remain high over time, the Symbiodinium will not return, leaving the corals’ white skeletons exposed and the animals defenseless against diseases and other stressors.
              </p>
            </div>,
            image: '../../static/images/splash/coral_bleaching_up_close.png',
            imageSelected: '../../static/images/splash/coral_bleaching_up_close_active.png'
          }
        ]
      },
      {
        name: 'dead',
        label: 'Dead',
        image: 'https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/images/dead-optimized.jpg',
        markup: ''
      }
    ]
  }
];
