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
            <p>
              Airport Reef is located off the island of Tutuila, the largest island in American Samoa. It’s part of the National Marine Sanctuary of American Samoa, a NOAA protected area. In this photo, the staghorn corals are healthy and abundant. But researchers returned just two months later to find the reef completely transformed by severe coral bleaching.
            </p>
            <p>
              Around the world, coral reefs feed and shelter thousands of species of fish, buffer coastal areas against damaging waves, and support local economies through tourism and fishing.
            </p>
            <p><i>Photo date: December 1, 2014</i></p>
          </div>,
        hotspots: [
          {
            title: 'Coral reefs by the numbers',
            id: 'coral_reefs_by_the_numbers',
            position: '0 2 -12',
            rotation: '0 0 0',
            markup:
              <div>
                <p>
                  <span className="header-text">More than 4000</span>
                   fish species <a href="http://www.wri.org/blog/2011/02/wake-call-save-coral-reefs" target="_blank" rel="noopener noreferrer">call reefs home</a>
                </p>
                <p>
                  <span className="header-text">One quarter to one third</span>
                   of ocean species <a href="http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0025026" target="_blank" rel="noopener noreferrer">depend on tropical reefs</a>
                </p>
                <p>
                  <span className="header-text">$29.8 billion</span>
                   is the <a href="http://www.icriforum.org/sites/default/files/Economic_values_global compilation.pdf" target="_blank" rel="noopener noreferrer">estimated yearly value</a> of all the services reefs provide, including tourism, coastal protection, fisheries and biodiversity
                </p>
                <p>
                  <span className="header-text">500 million</span>
                  people <a href="http://www.noaa.gov/explainers/coral-reefs-essential-and-threatened" target="_blank" rel="noopener noreferrer">depend on coral reefs</a> for their food and livelihoods
                </p>
                <p>
                  <span className="header-text">75</span>
                   percent of reefs worldwide <a href="http://www.reefresilience.org/pdf/Reefs_at_Risk_Revisited.pdf" target="_blank" rel="noopener noreferrer">are threatened</a> by warmer oceans and local threats such as coastal development, overfishing and pollution
                </p>
              </div>,
            image: '/static/images/splash/1-1_coral_reefs_by_the_numbers.png',
            imageSelected: '/static/images/splash/1-1_coral_reefs_by_the_numbers-active.png',
            imageWidth: 582,
            imageHeight: 458
          },
          {
            title: 'Pharmacies of the Sea',
            id: 'pharmacies_of_the_sea',
            position: '0 2 16',
            rotation: '0 180 0',
            markup:
              <div>
                Scientists are now <a href="http://issues.org/18-3/p_bruckner/" target="_blank" rel="noreferrer noopener">more likely to discover</a> new drugs in the ocean than on land, according to one reef ecologist. Studying the plants and animals found in reefs may help us to fight Alzheimer&rsquo;s disease, cancer, heart disease, <a href="https://oceanservice.noaa.gov/facts/coral_medicine.html" target="_blank" rel="noopener noreferrer">and more.</a> We&rsquo;re already using secosteroids, which corals create to protect themselves against illness, to treat asthma and arthritis.
              </div>,
            image: '/static/images/splash/1-2_pharmacies_of_the_sea.png',
            imageSelected: '/static/images/splash/1-2_pharmacies_of_the_sea-active.png',
            imageWidth: 502,
            imageHeight: 458
          },
          {
            title: 'Fisheries rely on reefs',
            id: 'fisheries_rely_on_reefs',
            position: '-14 2 0',
            rotation: '0 90 0',
            markup:
              <div>
                <div className="image-container">
                  <iframe src="https://staging.resourcewatch.org/embed/map/bc0ceb8f-f06c-4c3c-8433-548e900ff93b" width="100%" height="400" frameBorder="0"></iframe>
                  <div className="caption">
                    <i>Which countries depend most on coral reefs? Click and drag the map to explore. (Data source: WRI <a href="https://resourcewatch.org/data/explore/894f43a8-ce8e-43a5-a4c7-fa80faa43d63" target="_blank" rel="noopener noreferrer">Reefs at Risk</a>)</i>
                  </div>
                </div>
                <p>Coral reef fisheries employ more than <a href="http://www.reefresilience.org/coral-reef-fisheries-module/coral-reef-fisheries/overfishing/" target="_blank" rel="noopener noreferrer">6 million fishers and gleaners</a> and are worth an estimated <a href="http://www.reefresilience.org/pdf/Reefs_at_Risk_Revisited.pdf" target="_blank" rel="noopener noreferrer">$6.8 billion</a> per year.</p>
                <p>Reef fish are an important source of protein for many people, especially in developing countries, where they can contribute up to <a href="http://www.reefresilience.org/coral-reefs/reefs-and-resilience/value-of-reefs/" target="_blank" rel="noopener noreferrer">one quarter</a> of the total fish catch. (Reef fish feed <a href="http://www.reefresilience.org/coral-reefs/reefs-and-resilience/value-of-reefs/" target="_blank" rel="noopener noreferrer">an estimated one billion people</a> in Asia alone.) Fish stock around the world have declined, however, and over <a href="https://oceanservice.noaa.gov/news/weeklynews/feb11/reefs-at-risk.html" target="_blank" rel="noopener noreferrer">60 percent</a> of reef fisheries are considered threatened by local stressors, including overfishing, pollution and coastal development.</p>
              </div>,
            image: '/static/images/splash/1-3_fisheries_rely_on_reefs.png',
            imageSelected: '/static/images/splash/1-3_fisheries_rely_on_reefs-active.png',
            imageWidth: 502,
            imageHeight: 458
          }
        ]
      },
      {
        name: 'bleached',
        label: 'Bleached',
        image: 'https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/images/bleached-optimized.jpg',
        intro:
          <div>
            <p>
              This is Airport Reef off American Samoa. In 2015, many corals here lost their color in a dramatic—and destructive—stress response known as <a href="https://oceanservice.noaa.gov/facts/coral_bleach.html" target="_blank" rel="noopener noreferrer">coral bleaching.</a></p>
            <p>
              Prolonged exposure to warmer ocean temperatures and other stressors can cause corals to expel their symbiotic algae, leaving the corals’ white skeletons visible. (These algae give corals their color and nourish them through photosynthesis.) Some corals are able to bounce back from bleaching events if water temperatures decrease fast enough. In a warming ocean, however, <a href="https://www.coralcoe.org.au/media-releases/two-thirds-of-great-barrier-reef-hit-by-back-to-back-mass-coral-bleaching" target="_blank" rel="noopener noreferrer">corals will have less time to recover</a> between bouts of bleaching, and widespread die-off could occur.
            </p>
            <p>
              Airport Reef wasn’t alone. During a global bleaching event that lasted from 2014 to 2017, <a href="http://www.noaa.gov/media-release/global-coral-bleaching-event-likely-ending" target="_blank" rel="noopener noreferrer">more than 70 percent of the world’s reefs</a> experienced high ocean temperatures that lasted long enough to put them at risk of bleaching. Explore the other layers to see what Airport Reef looked like before and after this photo was taken. 
            </p>
            <p><i>Photo date: February 2, 2015</i></p>
          </div>,
        hotspots: [
          {
            title: 'Coral bleaching on the rise',
            id: 'coral_bleaching_on_the_rise',
            position: '0 2 -12',
            rotation: '0 0 0',
            markup:
              <div>
                <p>
                  In the past few decades, warmer ocean temperatures have contributed to more frequent and more harmful coral bleaching events around the world.
                </p>
                <iframe src="https://staging.resourcewatch.org/embed/widget/fdaabfda-9562-4562-a124-67c987a7e156" width="100%" height="474" frameBorder="0"></iframe>
                <p>
                  From 1980 to 1997, some 370 incidents of coral bleaching and disease were reported. From 1998 to 2012, that number exploded to more than 4,000. (This jump mostly reflects the destructive effect of rising ocean temperatures, though it should be noted that growing awareness, monitoring and communication of coral bleaching as an issue also played a role.)
                </p>
                <p>
                  The spike in 1998, which represents the first global coral bleaching event, was abnormally high; but, as the graph shows, the frequency of coral bleaching events dramatically increased in the following years as well.
                </p>
                <h3>What happened in 2002 and 2005?</h3>
                <p>
                  Warm ocean temperatures around Australia in 2002 caused widespread bleaching, leaving <a href="https://www.aims.gov.au/docs/research/climate-change/coral-bleaching/bleaching-events.html" target="_blank" rel="noopener noreferrer">more than half of the Great Barrier Reef&rsquo;s coral</a> bleached.
                </p>
                <p>
                  Another spike, in 2005, was attributed to particularly warm water in the Caribbean that left <a href="https://www.coris.noaa.gov/activities/caribbean_rpt/SCRBH2005_rpt.pdf" target="_blank" rel="noopener noreferrer">up to 40 percent</a> of reefs in the area bleached.
                </p>
              </div>,
            image: '/static/images/splash/coral_bleaching_on_the_rise.png',
            imageSelected: '/static/images/splash/coral_bleaching_on_the_rise_active.png',
            imageWidth: 578,
            imageHeight: 456
          },
          {
            title: 'Coral bleaching up close',
            id: 'coral_bleaching_up_close',
            position: '0 2 16',
            rotation: '0 180 0',
            markup:
              <div>
                <div className="video-container">
                  <iframe className="video" src="https://www.youtube.com/embed/bFdPmiwZzVE?rel=0&amp;showinfo=0" allowFullScreen />
                </div>
                <div className="video-caption">
                  <i>Video courtesy Queensland University of Technology / National Geographic</i>
                </div>
                <p>
                  When researchers at the <a href="https://www.qut.edu.au/news/news?news-id=108238" target="_blank" rel="noopener noreferrer">Queensland University of Technology in Australia</a> put corals in tanks and turned up the heat, the corals began violently spewing out the algae <i>Symbiodinium</i> in a matter of hours. It’s essentially coral bleaching on fast-forward. The university captured the process in this time-lapse video.
                </p>
                <p>
                  Normally symbiotic, <i>Symbiodinium</i> actually <a href="https://news.nationalgeographic.com/2016/08/coral-bleaching-video-algae-warming-oceans-environment-science/" target="_blank" rel="noopener noreferrer">becomes toxic to corals</a> at higher temperatures; the process on display in this video (called pulsed inflation) is a defense mechanism. It may protect them in the short term, but corals need the algae to recolonize quickly, because they rely on the algae to survive. If temperatures remain high over time, the <i>Symbiodinium</i> will not return, leaving the corals’ white skeletons exposed and the animals vulnerable to diseases and other stressors.
                </p>
              </div>,
            image: '/static/images/splash/coral_bleaching_up_close.png',
            imageSelected: '/static/images/splash/coral_bleaching_up_close_active.png',
            imageWidth: 578,
            imageHeight: 456
          },
          {
            title: 'Global coral bleaching events',
            id: 'global_coral_bleaching_events',
            position: '-14 2 0',
            rotation: '0 90 0',
            markup: <div>
              <h3>
                Global coral bleaching events
              </h3>
              <ul>
                <li><strong>First Event (1998):</strong> <a href="http://www.globalcoralbleaching.org/" target="_blank" rel="noopener noreferrer">Sixteen percent of corals worldwide</a> died in 1998 during the first global bleaching event. In 1997, a strong El Niño, followed by an equally strong La Niña, <a href="http://www.noaanews.noaa.gov/stories2015/100815-noaa-declares-third-ever-global-coral-bleaching-event.html" target="_blank" rel="noopener noreferrer">dramatically raised</a> global ocean surface temperatures. This change, on top of ocean warming from climate change, led to the first global coral bleaching event in 1998.</li>
                <li><strong>Second Event (2010):</strong> 2010 tied 2005 as <a href="https://www.nasa.gov/topics/earth/features/2010-warmest-year.html" target="_blank" rel="noopener noreferrer">the hottest year since 1998.</a> Warm ocean temperatures and <a href="https://news.agu.org/press-release/el-nino-prolongs-longest-global-coral-bleaching-event/" target="_blank" rel="noopener noreferrer">a moderate El Niño</a> touched off another global bleaching event, affecting reefs in <a href="https://www.nature.com/news/2010/101119/full/news.2010.621.html" target="_blank" rel="noopener noreferrer">every ocean and major sea</a> where corals are found.</li>
                <li><strong>Third Event (2014-2017):</strong> This has been the <a href="http://www.noaa.gov/media-release/global-coral-bleaching-event-likely-ending" target="_blank" rel="noopener noreferrer">longest and most widespread</a> global coral bleaching event to date. From 2014 to 2017, coral reefs around the world experienced higher-than-normal ocean temperatures, fueled by a partial <a href="https://coralreefwatch.noaa.gov/satellite/analyses_guidance/global_coral_bleaching_2014-17_status.php" target="_blank" rel="noopener noreferrer">El Niño in 2014-15</a> and worsened in the following years by a strong El Niño and a La Niña. This is the event that caused the bleaching here at Airport Reef. The Great Barrier Reef was heavily affected in 2015 and again in early 2017, leaving the <a href="http://www.noaa.gov/media-release/us-coral-reefs-facing-warming-waters-increased-bleaching" target="_blank" rel="noopener noreferrer">majority of corals bleached.</a></li>
              </ul>
            </div>,
            image: '/static/images/splash/global_coral_bleaching_events.png',
            imageSelected: '/static/images/splash/global_coral_bleaching_events_active.png',
            imageWidth: 622,
            imageHeight: 458
          }
        ]
      },
      {
        name: 'dead',
        label: 'Dead',
        image: 'https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/images/360_AMsam-unhealthy_low.jpg',
        intro:
          <div>
            <p>
              After the bleaching event in 2015, few healthy corals were left in Airport Reef. The algae seen here are not the symbiotic kind that usually keep company with corals, but rather a type of overgrown turf algae living on the skeletons of the dead animals.
            </p>
            <p>
              Widespread coral death can have <a href="http://time.com/coral/" target="_blank" rel="noopener noreferrer">dire consequences</a> for reef fish and coastal communities that depend on reefs for food, jobs and tourism. <a href="http://www.reefresilience.org/coral-reefs/stressors/local-stressors/overfishing-and-destructive-fishing-threats/" target="_blank" rel="noopener noreferrer">Nearly 95 percent of reefs</a> in Southeast Asia are already considered threatened. Without major progress in curbing global CO2 emissions that drive warmer ocean temperatures, and meaningful restrictions on such local threats as pollution and coastal development, coral reefs face an <a href="https://news.nationalgeographic.com/2017/06/coral-reef-bleaching-global-warming-unesco-sites/" target="_blank" rel="noopener noreferrer">uncertain future.</a>
            </p>
            <p><i>Photo date: August 3, 2015</i></p>
          </div>,
        hotspots: [
          {
            title: 'Humphead wrasse at risk',
            id: 'humphead_wrasse_at_risk',
            position: '0 2 -12',
            rotation: '0 0 0',
            markup:
              <div>
                <div className="image-container">
                  <img src="/static/images/splash/humpheadWrasseAtRisk.png" alt="Humphead wrasse at risk" />
                  <div className="caption">
                    <i>Photo by <a href="https://www.flickr.com/photos/travels_with_tam/32828868944/in/photolist-S1YwZN-7pTeih-53CDnm-68xUDN-8a1GLP-5eMKt-68Hims-Wcgp3W-u5ckV-bHdAKH-buiNqL-bHdAx6-9SxRHy-aLyYd-audraQ-buiNoo-6dw6bM-dXb1Ym-tJTSh-7XFLEG-52FSAK-zNpnRD-4JBbui-68itCP-5Bt6SY-auaLx4-4JBbL2-dyF4sg-t27QF-dyF4Gz-oJDWwu-buiNyY-bHdACX-bHdAHB-4WVKT5-auaM1r-eSVvJY-7x2bwZ-dGMUxo-9DfWFh-auaLrg-aqUVBZ-7uhhfe-9Dd2Kt-9DfXyW-3fMBfE-9yUnYo-7qHs7q-9Dd3ug-HCSn8v" target="_blank" rel="noopener noreferrer">Tam Warner Minton/Flickr</a></i>
                  </div>
                </div>
                <p>
                  This large, slow-growing fish is <a href="http://www.iucnredlist.org/details/4592/0" target="_blank" rel="noopener noreferrer">native</a> to the waters around American Samoa and throughout the Indo-Pacific but is now rarely seen. Largely due to overfishing and loss of habitat, the humphead wrasse population has been in decline for decades. (The fish was <a href="https://www.iucn.org/ssc-groups/fishes/grouper-and-wrasse-specialist-group/humphead-wrasse" target="_blank" rel="noopener noreferrer">designated an endangered species</a> in 2004.) Juvenile humphead wrasse depend on coral reefs for food and protection, and <a href="http://www.nmfs.noaa.gov/pr/pdfs/species/humpheadwrasse_detailed.pdf" target="_blank" rel="noopener noreferrer">coral bleaching</a> poses a serious threat to their habitat.
                </p>
              </div>,
            image: '/static/images/splash/3-1_humphead_wrasse_at_risk.png',
            imageSelected: '/static/images/splash/3-1_humphead_wrasse_at_risk-active.png',
            imageWidth: 542,
            imageHeight: 458
          },
          {
            title: "Coral bleaching: What's next",
            id: 'coral_bleaching_whats_next',
            position: '-14 2 0',
            rotation: '0 90 0',
            markup:
              <div>
                <p>
                  The National Oceanic and Atmospheric Organization (NOAA) announced in summer 2017 that the third global coral bleaching event <a href="http://www.noaa.gov/media-release/global-coral-bleaching-event-likely-ending" target="_blank" rel="noopener noreferrer">appeared to be on the wane.</a> But it’s a temporary reprieve. As this map reveals, things are set to get much worse.
                </p>
                <div className="image-container">
                  <iframe src="https://staging.resourcewatch.org/embed/map/bec6033c-e202-4b48-97a7-89093fdf31cc" width="100%" height="400" frameBorder="0"></iframe>
                  <div className="caption">
                    <i>Data source: WRI <a href="https://staging.resourcewatch.org/data/explore/894f43a8-ce8e-43a5-a4c7-fa80faa43d63" target="_blank" rel="noopener noreferrer">Reefs at Risk</a>, adapted from Donner, S.D., 2009 <a href="http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0005712" target="_blank" rel="noopener noreferrer">study in PLoS ONE.</a></i>
                  </div>
                </div>
                <p>
                  This map shows the projected frequency of what NOAA calls <a href="http://coralreefwatch-satops.noaa.gov/" target="_blank" rel="noopener noreferrer">Bleaching Alert Level 2 Events</a> for the 2030s and 2050s. (Specifically, it shows the percentage of years in each decade in which these events will likely occur.) A Bleaching Alert Level 2 Event is basically code red for corals, indicating intense heat stress and a likelihood that the corals will die.
                </p>
                <p>
                  The brighter the color, the more frequently these events are likely to occur. So, that wash of yellow and green that spreads across the map? It signifies a dramatic rise in both the range and frequency of the most severe levels of bleaching if carbon emissions continue unchecked.
                </p>
              </div>,
            image: '/static/images/splash/3-3_coral_bleaching__whats_next.png',
            imageSelected: '/static/images/splash/3-3_coral_bleaching__whats_next-active.png',
            imageWidth: 602,
            imageHeight: 458
          },
          {
            title: 'How can I help?',
            id: 'how_can_i_help',
            position: '14 2 0',
            rotation: '0 -90 0',
            markup:
              <div>
                <p>
                  <span className="header-text">Limit household waste</span>
                   such as fertilizer and chemicals, which can make it into waterways and <a href="https://blog.nature.org/conservancy/2010/03/23/how-lawn-chemicals-affect-the-oceans-how-you-can-help/" target="_blank" rel="noreferrer noopener">choke coral reefs.</a>
                </p>
                <p>
                  <span className="header-text">Eat sustainably</span>
                   and use <a href="https://www.fishwatch.gov/" target="_blank" rel="noopener noreferrer">this database</a> to choose seafood caught from sustainably managed fisheries that don’t threaten marine ecosystems.
                </p>
                <p>
                  <span className="header-text">Avoid damaging coral</span>
                   with boat anchors when you visit a reef. Don’t participate in destructive fishing practices, such as poison and blast fishing. And keep your flippers to yourself when diving.
                </p>
                <p>
                  <span className="header-text">Volunteer for beach or reef cleanups</span>
                   or get involved in protecting your local waterways.
                </p>
                <h3></h3>
                <p>
                  <span className="header-text">Conserve water and energy</span>
                   in your daily life to avoid unnecessary runoff, wastewater and CO2 emissions that pollute the ocean and contribute to climate change.
                </p>
                <p>
                  <i>Looking for more ways to reduce your coral reef footprint? <a href="http://www.wri.org/blog/2011/08/how-reduce-your-coral-reef-footprint" target="_blank" rel="noopener noreferrer">Read on.</a></i>
                </p>
              </div>,
            image: '/static/images/splash/3-4_how_can_i_help.png',
            imageSelected: '/static/images/splash/3-4_how_can_i_help-active.png',
            imageWidth: 422,
            imageHeight: 458
          }
        ]
      }
    ]
  }
];
