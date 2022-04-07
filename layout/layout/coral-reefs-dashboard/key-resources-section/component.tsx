import Link from 'next/link';
import Image from 'next/image';

const KeyResourcesSection = () => (
  <div id="key-resources" className="section">
    <h1>
      <strong>Key Resources</strong>
    </h1>

    <Image
      src="https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/content_images/images/000/000/194/cover/gcrmn_map_draft_5.png?1638814322"
      alt="GCRMN regions"
      width={1040}
      height={371}
      layout="responsive"
    />

    <div className="flex mt-2 space-x-3 lg:space-x-0 lg:mt-4">
      <ul className="flex-1 list-inside">
        <li className="list-disc list-item">
          <Link href="/dashboards/coral-reefs-red-sea-and-gulf-of-aden">
            <a className="underline text-blue">Red Sea and Gulf of Aden (RSGA)</a>
          </Link>
        </li>
        <li className="list-disc list-item">
          <Link href="/dashboards/coral-reefs-western-indian-ocean">
            <a className="underline text-blue">Western Indian Ocean (WIO)</a>
          </Link>
        </li>
        <li className="list-disc list-item">
          <Link href="/dashboards/coral-reefs-persian-gulf-and-gulf-of-oman">
            <a className="underline text-blue">Persian Gulf and Gulf of Oman (ROPME)</a>
          </Link>
        </li>
        <li className="list-disc list-item">
          <Link href="/dashboards/coral-reefs-south-asia">
            <a className="underline text-blue">South Asia</a>
          </Link>
        </li>
        <li className="list-disc list-item">
          <Link href="/dashboards/coral-reefs-east-asia">
            <a className="underline text-blue">East Asia</a>
          </Link>
        </li>
      </ul>
      <ul className="flex-1 list-inside">
        <li className="list-disc list-item">
          <Link href="/dashboards/coral-reefs-australia">
            <a className="underline text-blue">Australia</a>
          </Link>
        </li>
        <li className="list-disc list-item">
          <Link href="/dashboards/coral-reefs-pacific">
            <a className="underline text-blue">Pacific</a>
          </Link>
        </li>
        <li className="list-disc list-item">
          <Link href="/dashboards/coral-reefs-eastern-tropical-pacific">
            <a className="underline text-blue">Eastern Tropical Pacific (ETP)</a>
          </Link>
        </li>
        <li className="list-disc list-item">
          <Link href="/dashboards/coral-reefs-caribbean">
            <a className="underline text-blue">Caribbean</a>
          </Link>
        </li>
        <li className="list-disc list-item">
          <Link href="/dashboards/coral-reefs-brazil">
            <a className="underline text-blue">Brazil</a>
          </Link>
        </li>
      </ul>
    </div>

    <div className="subsection">
      <h2>
        <strong>Science and Management</strong>
      </h2>
      <ul className="bullet-list">
        <li>
          The{' '}
          <a href="https://reefresilience.org/" rel="noopener noreferrer" target="_blank">
            Reef Resilience Network
          </a>{' '}
          consolidates information on science and management approaches for coral reefs.&nbsp;
          <a
            href="https://reefresilience.org/resilience/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Resilience-based management
          </a>
          is an important management approach which addresses local threats within the context of
          global threats and the stakeholders / users of resources.
        </li>
        <li>
          <a href="https://coralreefwatch.noaa.gov/" rel="noopener noreferrer" target="_blank">
            NOAA Coral Reef Watch
          </a>{' '}
          provides near real-time data on sea surface temperature and modeled outlooks of bleaching
          risk.
        </li>
        <li>
          {' '}
          <a href="https://allencoralatlas.org/" rel="noopener noreferrer" target="_blank">
            Allen Coral Atlas
          </a>{' '}
          is a partnership developing high resolution maps of coral reefs and other benthic habitat,
          geomorphology, and other tools, including identifying potential large coral bleaching
          events using satellite imagery.
        </li>
        <li>
          {' '}
          <a href="http://crc.reefresilience.org/" rel="noopener noreferrer" target="_blank">
            Coral Restoration Consortium (CRC)
          </a>
          <span>
            {' '}
            is a community of practice comprised of scientists, managers, coral restoration
            practitioners, and educators developing and sharing tools, technologies and knowledge to
            help restore coral reefs.{' '}
          </span>
        </li>
        <li>
          {' '}
          <a href="https://gbrrestoration.org/" rel="noopener noreferrer" target="_blank">
            Reef Restoration and Adaptation Program (RRAP)
          </a>{' '}
          brings together Australia&apos;s leading experts to create an innovative suite of safe,
          acceptable interventions to help the Great Barrier Reef resist, adapt to, and recover from
          the impacts of climate change.
        </li>
      </ul>
    </div>
    <div className="subsection">
      <h2>
        <strong>Protected Areas</strong>
      </h2>
      <ul className="bullet-list">
        <li>
          {' '}
          <a href="https://lmmanetwork.org/" rel="noopener noreferrer" target="_blank">
            Locally Managed Marine Area (LMMA)
          </a>
          <span>
            {' '}
            is an international network of natural resource management practitioners who share
            knowledge on best practices{' '}
          </span>
        </li>
        <li>
          <a
            href="https://www.protectedplanet.net/en/thematic-areas/marine-protected-areas"
            rel="noopener noreferrer"
            target="_blank"
          >
            Protect Planet
          </a>{' '}
          provides data MPAs updated monthly with submissions from governments, non-governmental
          organizations, landowners and communities.&nbsp;&nbsp;&nbsp;
        </li>
        <li>
          {' '}
          <a href="https://mpatlas.org/" rel="noopener noreferrer" target="_blank">
            Marine Protection Atlas (MPAtlas)
          </a>{' '}
          augments spatial data on MPAs to attempt to distinguish MPAs by implementation status and
          by protection level (such as no-take, fully, and highly protected areas). This ongoing
          effort (updated monthly) uses (soon to be published), scientifically-based criteria for
          measuring an MPA’s protection level and associated conservation outcomes.
        </li>
        <li>
          {' '}
          <a
            href="https://habitats.oceanplus.org/#coralreef"
            rel="noopener noreferrer"
            target="_blank"
          >
            Ocean + Habitats
          </a>{' '}
          is an evolving tool that provides insight into the known extent, protection and other
          statistics of ecologically and economically important ocean habitats, such as corals,
          mangroves, seagrasses and saltmarshes.
        </li>
      </ul>
      <div className="row subsection">
        <div className="image-container column small-12 medium-6">
          <Image
            src="https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/temporary_content_images/images/000/000/393/original/CoralReefImageBank_Pacific_HannesKlostermann_03.jpg?1611951799&amp;temp_id=393"
            alt="CoralReefImageBank_Pacific_HannesKlostermann_03.jpg"
            width={1280}
            height={853}
            layout="responsive"
          />
          <div className="image-caption">
            <em>Photo: Hannes Klostermann - Coral Reef Image Bank</em>
          </div>
        </div>
        <div className="image-container column small-12 medium-6">
          <Image
            src="https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/temporary_content_images/images/000/000/394/original/IYORBank_ReefAnimals_TheOceanAgency_06.jpg?1611951909&amp;temp_id=394"
            alt="IYORBank_ReefAnimals_TheOceanAgency_06.jpg"
            width={1280}
            height={850}
            layout="responsive"
          />
          <div className="image-caption">
            <em>Photo: The Ocean Agency - Coral Reef Image Bank</em>
          </div>
        </div>
      </div>
      <div className="subsection">
        <h2>
          <strong>Status and Trends</strong>
        </h2>
        <ul className="bullet-list">
          <li>
            {' '}
            <a href="https://gcrmn.net/" rel="noopener noreferrer" target="_blank">
              Global Coral Reef Monitoring Network (GCRMN
            </a>
            ) works through a global network of researchers&nbsp;to&nbsp;provide the best available
            scientific information on the health of coral reef ecosystems, for their conservation
            and management.
          </li>
          <li>
            <a href="https://www.aims.gov.au/" rel="noopener noreferrer" target="_blank">
              Australian Institute of Marine Sciences (AIMS)
            </a>{' '}
            monitors the condition of coral reefs throughout Australia, including the Great Barrier
            Reef.
          </li>
          <li>
            <a href="https://www.agrra.org/" rel="noopener noreferrer" target="_blank">
              Atlantic and Gulf Rapid Reef Assessment (AGGRA
            </a>
            ) uses a standardized method to conduct surveys of coral reef health across the Western
            Atlantic / Caribbean and Gulf of Mexico.
          </li>
          <li>
            <a href="http://www.cordio.org/" rel="noopener noreferrer" target="_blank">
              Coral Reef Degradation in the Indian Ocean (CORDIO)
            </a>{' '}
            is a collaborative program involving researchers in 11 countries in the central and
            western Indian Ocean focused on assessing degradation of coral reefs, mitigating damage
            to&nbsp;reefs&nbsp;and promoting alternative livelihoods for people dependent
            on&nbsp;reefs.
          </li>
          <li>
            <a
              href="https://www.healthyreefs.org/cms/report-cards/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Healthy Reefs
            </a>{' '}
            for Healthy People has developed indicators of reef health and published a series of
            report cards for the Mesoamerican Reef.
          </li>
          <li>
            {' '}
            <a
              href="https://www.livingoceansfoundation.org/global-reef-expedition/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Khaled bin Sultan Living Oceans Foundation
            </a>{' '}
            recently{' '}
            <span>
              completed field research for one of the largest coral reef studies in history – the
              Global Reef Expedition – to map and characterize coral reef ecosystems, identify their
              current status and major threats, and examine factors influencing resilience.{' '}
            </span>
          </li>
          <li>
            <a href="https://www.spc.int/resource-centre" rel="noopener noreferrer" target="_blank">
              The Pacific Community (SPC)
            </a>
            <span> is the principal scientific and technical organization in</span>
          </li>
          <li>
            <span>the Pacific region - governed by its 26 country and territory members. Its </span>
            <a href="https://pacificdata.org/" rel="noopener noreferrer" target="_blank">
              Pacific Data Hub
            </a>
            <span> includes an ocean portal focused on </span>
            <a
              href="http://oceanportal.spc.int/portal/app.html#coral"
              rel="noopener noreferrer"
              target="_blank"
            >
              coral reefs
            </a>
            <span>.&nbsp;</span>
          </li>
          <li>
            {' '}
            <a
              href="https://www.coris.noaa.gov/monitoring/status_report/"
              rel="noopener noreferrer"
              target="_blank"
            >
              US Coral Reef Information System (CORIS)
            </a>{' '}
            <span>
              provides national coral reef monitoring and status reports for Atlantic and Pacific
              reefs.
            </span>
          </li>
          <li>
            {' '}
            <a href="https://www.wiomsa.org/" rel="noopener noreferrer" target="_blank">
              Western Indian Ocean Marine Science Association (WIOMSA)&nbsp;
            </a>
            <span>
              is dedicated to promoting the educational, scientific, and technological development
              of all aspects of coastal and marine sciences (including socioeconomic and management
              sciences) and to support sustainable development in the Western Indian Ocean
              region.&nbsp;
            </span>
          </li>
        </ul>
      </div>
      <div className="subsection">
        <h2>
          <strong>Government and Policy</strong>
        </h2>
        <ul className="bullet-list">
          <li>
            {' '}
            <a href="https://www.icriforum.org/" rel="noopener noreferrer" target="_blank">
              International Coral Reef Initiative (ICRI)
            </a>{' '}
            is a
            <span>
              {' '}
              global partnership focused on the preservation of the world’s coral reefs and
              associated ecosystems. ICRI’s 90 members include a mix of governments,
              non-governmental organizations and international organizations. Member countries are
              custodians of 75% of the world’s coral reefs. ICRI highlights the{' '}
            </span>
            <a
              href="https://www.icriforum.org/wp-content/uploads/2020/05/ICRI-social-video.mp4?_=1"
              rel="noopener noreferrer"
              target="_blank"
            >
              urgency of action
            </a>
            <span>. </span>
          </li>
          <li>
            {' '}
            <a
              href="https://www.icriforum.org/wp-content/uploads/2020/05/Coral_Policy%20(1).pdf"
              rel="noopener noreferrer"
              target="_blank"
            >
              Analysis of Policies Related to the Protection of Coral Reefs
            </a>
            <span> covers global and regional policy instruments and governance mechanisms.</span>
          </li>
          <li>
            <a
              href="https://www.unenvironment.org/explore-topics/oceans-seas/what-we-do/working-regional-seas"
              rel="noopener noreferrer"
              target="_blank"
            >
              United Nations Environment Programme (UNEP)
            </a>{' '}
            <span>
              promotes the protection and sustainable management of the world’s marine and coastal
              environments. The{' '}
            </span>
            <a
              href="https://www.unenvironment.org/explore-topics/oceans-seas/what-we-do/working-regional-seas"
              rel="noopener noreferrer"
              target="_blank"
            >
              Regional Seas Programme
            </a>
            , comprised of eighteen regions, implements many of UNEP’s marine-related policies.
          </li>
          <li>
            {' '}
            <a
              href="https://bluecharter.thecommonwealth.org/action-groups/coral-reef-restoration/"
              rel="noopener noreferrer"
              target="_blank"
            >
              The Commonwealth Blue Charter Action Group on Coral Reef Protection and Restoration
            </a>{' '}
            is part of an agreement by all 54 Commonwealth countries to&nbsp;actively cooperate to
            solve ocean-related problems and meet commitments for sustainable ocean development,
            with particular emphasis on the{' '}
            <a href="https://sdgs.un.org/goals" rel="noopener noreferrer" target="_blank">
              UN Sustainable Development Goals (SDGs)
            </a>
            , especially{' '}
            <a href="https://sdgs.un.org/goals/goal14" rel="noopener noreferrer" target="_blank">
              SDG 14 (Life Below Water).
            </a>
          </li>
          <li>
            {' '}
            <a href="https://www.coralreef.gov/" rel="noopener noreferrer" target="_blank">
              United States Coral Reef Task force (USCRTF)
            </a>
            , which includes leaders of 14 Federal agencies and all US States, Territories,
            Commonwealths and Freely Associated States containing coral reefs, works to build
            partnerships, strategies, and support for conservation of coral reefs.
          </li>
          <li>
            {' '}
            <a
              href="https://oceanconference.un.org/commitments/?id=15692"
              rel="noopener noreferrer"
              target="_blank"
            >
              French Coral Reef Initiative (IFRECOR
            </a>
            ){' '}
            <span>
              promotes the protection and sustainable management of coral reefs and their associated
              ecosystems in the nine concerned overseas territories.
            </span>
          </li>
          <li>
            {' '}
            <a
              href="http://www.coraltriangleinitiative.org/"
              rel="noopener noreferrer"
              target="_blank"
            >
              The Coral Triangle Initiative on Coral Reefs, Fisheries, and Food Security (CTI-CFF)
            </a>
            <span>
              {' '}
              is a multilateral partnership of six countries working together to sustain
              extraordinary marine and coastal resources of the region.{' '}
            </span>
          </li>
        </ul>
      </div>
      <div className="row subsection">
        <div className="image-container column small-12 medium-6">
          <Image
            src="https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/temporary_content_images/images/000/000/395/original/IYORBank_PeopleontheReef_Jett_Britnell_04_reduced.jpg?1611952198&amp;temp_id=395"
            alt="IYORBank_PeopleontheReef_Jett Britnell_04_reduced.jpg"
            width={2126}
            height={1414}
            layout="responsive"
          />

          <div className="image-caption">
            <em>Photo: Jett Britnell - Coral Reef Image Bank</em>
          </div>
        </div>
        <div className="image-container column small-12 medium-6">
          <Image
            src="https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/temporary_content_images/images/000/000/400/original/shrimp_kri.jpg?1612220805&amp;temp_id=400"
            alt="shrimp_kri.jpg"
            width={1136}
            height={760}
            layout="responsive"
          />
          <div className="image-caption">
            <em>Photo: Krishna Desai</em>
          </div>
        </div>
      </div>
      <div className="subsection">
        <h2>
          <strong>Ecosystem Values</strong>
        </h2>
        <ul className="bullet-list">
          <li>
            {' '}
            <a href="https://oceanwealth.org/" rel="noopener noreferrer" target="_blank">
              Mapping Ocean Wealth
            </a>{' '}
            – provides maps of estimated value of ecosystem services provided by coral reefs and
            mangroves, including fisheries, tourism, shoreline protection and carbon storage.
          </li>
          <li>
            Economic and social value of the{' '}
            <a
              href="https://www2.deloitte.com/content/dam/Deloitte/au/Documents/Economics/deloitte-au-economics-great-barrier-reef-230617.pdf"
              rel="noopener noreferrer"
              target="_blank"
            >
              Great Barrier Reef&nbsp;
            </a>
          </li>
          <li>
            Economic value of coral reef ecosystems in the{' '}
            <a
              href="https://www.iyor2018.org/wp-content/uploads/2017/12/Plaquette-ValoEco_Synthese-EN-web.pdf"
              rel="noopener noreferrer"
              target="_blank"
            >
              French Overseas Territories&nbsp;
            </a>
          </li>
        </ul>
      </div>
      <div className="subsection">
        <h2>
          <strong>Getting Involved: What you can do to help</strong>
        </h2>
        <ul className="bullet-list">
          <li>
            {' '}
            <a
              href="https://aamboceanservice.blob.core.windows.net/oceanservice-prod/facts/coralinfographic.pdf"
              rel="noopener noreferrer"
              target="_blank"
            >
              Live Sustainably
            </a>{' '}
            – choose sustainable seafood, eat lower on the food chain, be aware when boating, diving
            and snorkeling, practice energy efficiency, fly less, avoid the use of single-use
            plastics.
          </li>
          <li>
            Be a{' '}
            <a
              href="https://coral.org/what-you-can-do/take-action/when-traveling/"
              rel="noopener noreferrer"
              target="_blank"
            >
              sustainable traveler
            </a>
            .
          </li>
          <li>
            {' '}
            <a
              href="https://www.greenamerica.org/fight-dirty-energy-grow-clean-energy/divest-reinvest/steps-divest-reinvest"
              rel="noopener noreferrer"
              target="_blank"
            >
              Divest from investments in fossil fuels and reinvest in sustainability
            </a>{' '}
            – including retirement funds and personal investment. Environmental and socially
            responsible funds provide incentives for reducing carbon emissions and water
            pollution.&nbsp;
          </li>
          <li>Donate time or money to organizations and causes you care about.</li>
          <li>
            Learn more through many{' '}
            <a href="https://www.iyor2018.org/resources/" rel="noopener noreferrer" target="_blank">
              games, graphics, short films, pamphlets
            </a>
            , and{' '}
            <a
              href="https://encounteredu.com/teacher-resources/coral-oceans-science-ages-7-11"
              rel="noopener noreferrer"
              target="_blank"
            >
              science modules
            </a>
            . Share them to help spread the word about the critical importance of the world’s coral
            reefs.
          </li>
          <li>
            Explore the commitments made under the UN{' '}
            <a
              href="https://oceanconference.un.org/coa/CoralReefs"
              rel="noopener noreferrer"
              target="_blank"
            >
              Communities of Action on Coral Reefs
            </a>
          </li>
          <li>
            Educate others about the importance of and threats to coral reefs – share the video{' '}
            <a
              href="https://www.youtube.com/watch?v=Jn5-ARXmQlQ&amp;feature=emb_logo"
              rel="noopener noreferrer"
              target="_blank"
            >
              Polyps in Peril.&nbsp;
            </a>
          </li>
        </ul>
      </div>
      <div className="row subsection">
        <div className="image-container column small-12 medium-6">
          <Image
            src="https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/temporary_content_images/images/000/000/399/original/29b.Jane_Harris_coralgarden_reefbase.jpg?1611959660&amp;temp_id=399"
            alt="29b.Jane Harris_coralgarden_reefbase.jpg"
            width={2844}
            height={1842}
            layout="responsive"
          />
          <div className="image-caption">
            <em>Photo: Jane Harris</em>
          </div>
        </div>
        <div className="image-container column small-12 medium-6">
          <Image
            src="https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/temporary_content_images/images/000/000/402/original/IYORBank_PeopleandtheReef_Yen-YiLee_02_reduced_cropped.jpg?1612305234&amp;temp_id=402"
            alt="IYORBank_PeopleandtheReef_Yen-YiLee_02_reduced_cropped.jpg"
            width={1998}
            height={1293}
            layout="responsive"
          />
        </div>
        <div className="image-caption">
          <em>Photo: Yen-Yi Lee, Coral Reef Photo Bank</em>
        </div>
      </div>
    </div>
  </div>
);

export default KeyResourcesSection;
