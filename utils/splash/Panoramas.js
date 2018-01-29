import React from 'react';

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
        intro:
          <div>
            <p>Airport Reef is located off the island of Tutuila, the largest island in American Samoa. It’s part of the National Marine Sanctuary of American Samoa, a NOAA protected area. In this photo, the staghorn corals are healthy and abundant. But researchers returned just two months later to find the reef completely transformed by severe coral bleaching. Around the world, coral reefs feed and shelter thousands of species of fish, buffer coastal areas against damaging waves, and support local economies through tourism and fishing.
            </p>
            <p>Photo date: December 1, 2014</p>
          </div>,
        hotspots: [
          {
            title: 'Coral reefs by the numbers',
            id: 'coral_reefs_by_the_numbers',
            position: '0 2 -12',
            rotation: '0 0 0',
            markup:
              <div>
                <h3>More than 4000</h3>
                <p>fish species call <a href="http://www.wri.org/blog/2011/02/wake-call-save-coral-reefs" target="_blank" rel="noopener noreferrer">reefs home</a></p>
                <h3>One quarter to one third</h3>
                <p>of ocean species <a href="http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0025026" target="_blank" rel="noopener noreferrer">depend on tropical reefs.</a></p>
                <h3>$29.8 billion</h3>
                <p>is the <a href="http://www.icriforum.org/sites/default/files/Economic_values_global compilation.pdf" target="_blank" rel="noopener noreferrer">estimated yearly value</a> of all the services reefs provide, including tourism, coastal protection, fisheries and biodiversity</p>
                <h3>500 million</h3>
                <p>people <a href="http://www.noaa.gov/explainers/coral-reefs-essential-and-threatened" target="_blank" rel="noopener noreferrer">depend on coral reefs</a> for their food and livelihoods</p>
                <h3>75</h3>
                <p>percent of reefs worldwide <a href="http://www.reefresilience.org/pdf/Reefs_at_Risk_Revisited.pdf" target="_blank" rel="noopener noreferrer">are threatened</a> by warmer oceans and local threats such as coastal development, overfishing and pollution</p>
              </div>,
            image: '../../static/images/splash/coral_bleaching_on_the_rise.png',
            imageSelected: '../../static/images/splash/coral_bleaching_on_the_rise_active.png'
          },
          {
            title: 'Pharmacies of the Sea',
            id: 'pharmacies_of_the_sea',
            position: '0 2 16',
            rotation: "0 180 0",
            markup:
              <div>
                Scientists are now <a href="http://issues.org/18-3/p_bruckner/" target="_blank" rel="noreferrer noopener">more likely to discover</a> new drugs in the ocean than on land, according to one reef ecologist. Studying the plants and animals found in reefs may help us to fight Alzheimer&rsquo;s disease, cancer, heart disease, <a href="https://oceanservice.noaa.gov/facts/coral_medicine.html" target="_blank" rel="noopener noreferrer">and more.</a> We&rsquo;re already using secosteroids, which corals create to protect themselves against illness, to treat asthma and arthritis.
              </div>,
            image: '../../static/images/splash/coral_bleaching_on_the_rise.png',
            imageSelected: '../../static/images/splash/coral_bleaching_on_the_rise_active.png'
          },
          {
            title: 'Fisheries rely on reefs',
            id: 'fisheries_rely_on_reefs',
            position: '-14 2 0',
            rotation: "0 90 0",
            markup:
              <div>
                <iframe src="https://staging.resourcewatch.org/embed/map/9027ee71-fd13-4035-83b6-bb8d0a3a65e9" width="100%" height="474" frameBorder="0"></iframe>
                <i>Which countries depend most on coral reefs? Click and drag the map to explore.</i>
                <p>Coral reef fisheries employ more than <a href="http://www.reefresilience.org/coral-reef-fisheries-module/coral-reef-fisheries/overfishing/" target="_blank" rel="noopener noreferrer">6 million fishers and gleaners</a> and are worth an estimated <a href="http://www.reefresilience.org/pdf/Reefs_at_Risk_Revisited.pdf" target="_blank" rel="noopener noreferrer">$6.8 billion</a> per year.</p>
                <p>Reef fish are an important source of protein for many people, especially in developing countries, where they can contribute up to <a href="http://www.reefresilience.org/coral-reefs/reefs-and-resilience/value-of-reefs/" target="_blank" rel="noopener noreferrer">one quarter</a> of the total fish catch. (Reef fish feed <a href="http://www.reefresilience.org/coral-reefs/reefs-and-resilience/value-of-reefs/" target="_blank" rel="noopener noreferrer">an estimated one billion people</a> in Asia alone.) Fish stock around the world have declined, however, and over <a href="https://oceanservice.noaa.gov/news/weeklynews/feb11/reefs-at-risk.html" target="_blank" rel="noopener noreferrer">60 percent</a> of reef fisheries are considered threatened by local stressors, including overfishing, pollution and coastal development.</p>
              </div>
          }
        ]
      },
      {
        name: 'bleached',
        label: 'Bleached',
        image: 'https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/images/bleached-optimized.jpg',
        intro: <div>
          <p>What might resemble a beautiful snowfall is actually a destructive stress response known as coral bleaching, which occurred in Airport Reef in 2015. Prolonged exposure to warmer ocean temperatures can cause corals to expel their symbiotic algae (which gives color to corals and nourishes them through photosynthesis), leaving the corals’ white skeletons visible. Some corals are able to bounce back from a bleaching event if water temperatures decrease fast enough. In a warming ocean, however, <a href="https://www.coralcoe.org.au/media-releases/two-thirds-of-great-barrier-reef-hit-by-back-to-back-mass-coral-bleaching" target="_blank" rel="noopener noreferrer">corals will have less time to recover</a> between bleaching events, and widespread die-off could occur.</p>
          <p>Photo date: February 2, 2015</p>
        </div>,
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
                <iframe src="https://staging.resourcewatch.org/embed/widget/a47df7b0-0cdb-4fc2-a877-7c4324c1d6fa" width="100%" height="474" frameBorder="0" />
                <p/>
                <h3>
                  What happened in 2002 and 2005?
                </h3>
                <p>
                  Warm ocean temperatures in 2002 caused widespread bleaching, hitting the area around the Great Barrier Reef the hardest. <a href="https://link.springer.com/article/10.1007/s00338-003-0353-y" target="_blank" rel="noopener noreferrer">More than half</a> of the Great Barrier Reef’s corals bleached that year.
                </p>
                <p>
                  Another spike in 2005 was attributed to an underwater heat wave in the Caribbean, leaving <a href="https://www.coris.noaa.gov/activities/caribbean_rpt/SCRBH2005_rpt.pdf" target="_blank" rel="noopener noreferrer">up to 40 percent</a> of reefs bleached there.
                </p>
              </div>,
            image: '../../static/images/splash/coral_bleaching_on_the_rise.png',
            imageSelected: '../../static/images/splash/coral_bleaching_on_the_rise_active.png'
          },
          {
            title: 'Coral bleaching up close',
            id: 'coral_bleaching_up_close',
            position: '0 2 16',
            rotation: "0 180 0",
            markup:
              <div>
                <div className="video-container">
                  <iframe className="video" src="https://www.youtube.com/embed/bFdPmiwZzVE?rel=0&amp;showinfo=0" allowFullScreen />
                </div>
                <p>
                  When researchers at the <a href="https://www.qut.edu.au/news/news?news-id=108238" target="_blank" rel="noopener noreferrer">Queensland University of Technology in Australia</a> put corals in tanks and turned up the heat by several degrees, the corals began violently spewing out the algae Symbiodinium in a matter of hours. It’s essentially coral bleaching on fast-forward. The university captured the process in this time-lapse video.
                </p>
                <p>
                  Normally symbiotic, Symbiodinium actually <a href="https://news.nationalgeographic.com/2016/08/coral-bleaching-video-algae-warming-oceans-environment-science/" target="_blank" rel="noopener noreferrer">becomes toxic to corals</a> at higher temperatures; the process on display in this video (called pulsed inflation) is a defense mechanism. It may protect them in the short term, but corals need this algae to recolonize quickly, because they rely on the sugar the algae produce for nourishment. If temperatures remain high over time, the Symbiodinium will not return, leaving the corals’ white skeletons exposed and the animals defenseless against diseases and other stressors.
                </p>
              </div>,
            image: '../../static/images/splash/coral_bleaching_up_close.png',
            imageSelected: '../../static/images/splash/coral_bleaching_up_close_active.png'
          },
          {
            title: 'Global coral bleaching events',
            id: 'global_coral_bleaching_events',
            position: '-14 2 0',
            rotation: "0 90 0",
            markup: <div>
              <h3>
                Global coral bleaching events
              </h3>
              <ul>
                <li><strong>First Event (1998):</strong> In 1997, an unusually strong El Niño followed by a La Niña dramatically changed global ocean surface temperatures. Exacerbated by the general effects of global warming, these temperature changes led to the first mass coral bleaching in 1998. An estimated 16 percent of coral died in 1998 alone.</li>
                <li><strong>Second Event (2010):</strong> 2010 set a new record for the hottest year, surpassing 1998. Warm ocean temperatures and a moderate El Niño caused another global bleaching event, affecting reefs in every ocean basin.</li>
                <li><strong>Third Event (2014-2017):</strong> This has been the longest and most widespread global coral bleaching event to date. From 2014 to 2017, coral reefs around the world experienced higher-than-normal ocean temperatures, fueled by a partial <a href="https://coralreefwatch.noaa.gov/satellite/analyses_guidance/global_coral_bleaching_2014-17_status.php" target="_blank" rel="noopener noreferrer">El Niño in 2014-15</a> and worsened by a strong El Niño and a La Niña in the following years. This is the event that caused the bleaching here at Airport Reef. The Great Barrier Reef was heavily affected in 2015 and again in early 2017, leaving the <a href="http://www.noaa.gov/media-release/us-coral-reefs-facing-warming-waters-increased-bleaching" target="_blank" rel="noopener noreferrer">majority of coral</a> bleached.</li>
              </ul>
            </div>,
            image: '../../static/images/splash/global_coral_bleaching_events.png',
            imageSelected: '../../static/images/splash/global_coral_bleaching_events_active.png'
          }
        ]
      },
      {
        name: 'dead',
        label: 'Dead',
        image: 'https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/images/360_AMsam-unhealthy_low.jpg',
        markup: ''
      }
    ]
  }
];
