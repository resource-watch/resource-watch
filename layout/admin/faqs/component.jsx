import { useRouter } from 'next/router';

// components
import Layout from 'layout/layout/layout-admin';
import Tabs from 'components/ui/Tabs';
import FaqsIndex from 'components/admin/faqs/pages/list';
import Title from 'components/ui/Title';

// constants
import { FAQS_TABS } from './constants';

export default function LayoutAdminFaqs() {
  const {
    query: {
      tab,
    },
  } = useRouter();
  const currentTab = tab || 'faqs';

  return (
    <Layout
      title="FAQs"
      // TO-DO: fill description
      description="Faqs description..."
    >
      <div className="c-page-header -admin">
        <div className="l-container -admin">
          <div className="page-header-content -with-tabs">
            <Title className="-primary -huge page-header-title">
              FAQs
            </Title>
            <Tabs
              options={FAQS_TABS}
              defaultSelected={currentTab}
              selected={currentTab}
            />
          </div>
        </div>
      </div>
      <div className="c-page-section">
        <div className="l-container -admin">
          <FaqsIndex />
        </div>
      </div>
    </Layout>
  );
}

// class LayoutAdminFaqs extends PureComponent {
//   static propTypes = { query: PropTypes.object.isRequired }

//   render() {
//     const { query: { tab } } = this.props;
//     // TO-DO: set properly this in express
//     const currentTab = tab || 'faqs';

//     return (
//       <Layout
//         title="FAQs"
//         // TO-DO: fill description
//         description="Faqs description..."
//       >
//         <div className="c-page-header -admin">
//           <div className="l-container -admin">
//             <div className="page-header-content -with-tabs">
//               <Title className="-primary -huge page-header-title">
//                 FAQs
//               </Title>
//               <Tabs
//                 options={FAQS_TABS}
//                 defaultSelected={currentTab}
//                 selected={currentTab}
//               />
//             </div>
//           </div>
//         </div>
//         <div className="c-page-section">
//           <div className="l-container -admin">
//             <FaqsIndex />
//           </div>
//         </div>
//       </Layout>
//     );
//   }
// }

// export default LayoutAdminFaqs;
