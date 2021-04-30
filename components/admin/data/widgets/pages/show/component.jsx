import {
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { StickyContainer, Sticky } from 'react-sticky';
import { useRouter } from 'next/router';
import { substitution } from 'layer-manager';

// components
import Aside from 'components/ui/Aside';
import WidgetForm from 'components/admin/data/widgets/form';
import MetadataForm from 'components/widgets/metadata/form/MetadataForm';

// constants
import { WIDGET_SUBTABS } from './constants';

export default function WidgetsShow({
  user,
}) {
  const router = useRouter();
  const {
    query: {
      params,
    },
  } = router;
  const id = params?.[1];
  const currentSubTab = params?.[2] || 'edit';

  const tabs = useMemo(() => JSON
    .parse(substitution(JSON.stringify(WIDGET_SUBTABS), { id })),
  [id]);

  const handleSubmit = useCallback(() => { window.scrollTo(0, 0); }, []);

  const handleMetadataSubmit = useCallback(() => {
    router.push(`/admin/data/widgets/${id}/edit`);
  }, [router, id]);

  return (
    <div className="c-widgets-show">
      <StickyContainer>
        <div className="row l-row">
          <div className="columns small-12 medium-3">
            <Sticky>
              {
                ({ style }) => (
                  <div style={style}>
                    <Aside
                      items={tabs}
                      selected={currentSubTab}
                    />
                  </div>
                )
              }
            </Sticky>
          </div>

          <div className="columns small-12 medium-9">
            {(currentSubTab === 'edit')
            && (
            <WidgetForm
              id={id}
              authorization={user.token}
              onSubmit={handleSubmit}
            />
            )}

            {(currentSubTab === 'metadata')
              && (
              <MetadataForm
                application={process.env.NEXT_PUBLIC_APPLICATIONS}
                authorization={user.token}
                widget={id}
                onSubmit={handleMetadataSubmit}
              />
              )}
          </div>

        </div>
      </StickyContainer>
    </div>
  );
}

WidgetsShow.propTypes = {
  user: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }).isRequired,
};
