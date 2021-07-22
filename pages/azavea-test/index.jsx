// actions
// None at the moment

// Layout
// We could put all our markup straight into this Page, but given that we may end up with multiple
// sub-pages inside of this page, it seems like the recommended thing to do is to wrap in a Layout.
// But currently this seems kind of boiler-plateish to me, so if it stays that way after we have
// some more complex content then we should probably refactor so that this file actually does
// something useful.
import AzaveaTestLayout from 'layout/azavea-test';

export default function AzaveaTestPage() {
  return (<AzaveaTestLayout />);
}
