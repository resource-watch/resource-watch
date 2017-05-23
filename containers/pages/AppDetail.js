import { connect } from 'react-redux';
import AppDetail from 'components/pages/AppDetail';
// import getPartnerData from 'selectors/partners/partner';

const mapStateToProps = state => ({
  app: {
    name: 'Track Deforestation in Real Time',
    description: 'Mauris non tempor quam, et lacinia sapien. Mauris accumsan eros eget libero posuere vulputate. Etiam elit elit, elementum sed varius at, adipiscing vitae est. Sed nec felis pellentesque, lacinia dui sed, ultricies sapien. Pellentesque orci lectus, consectetur vel posuere posuere, rutrum eu ipsum. Aliquam eget odio sed ligula iaculis consequat at eget orci. Mauris molestie sit amet metus mattis varius.',
    source: 'Global Forest Watch',
    specs: 'Requires iOS 6.0 or later. Compatible with iPhone, iPad, and iPod touch. This app is optimized for iPhone 5, iPhone 6, and iPhone 6 Plus.',
    languages: ['English', 'Spanish', 'French', 'German', 'Russian'],
    stars: 5230
  }
});

//
// const mapDispatchToProps = dispatch => ({
//   getLayers: () => {
//     dispatch(getLayers());
//   },
// });

export default connect(mapStateToProps, null)(AppDetail);
