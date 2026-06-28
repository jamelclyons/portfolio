import React, { useEffect } from 'react';

import { Section, Main } from '@the7ofdiamonds/ui-ux';

const NotFound: React.FC = () => {
  useEffect(() => {
    document.title = '404 - Page Not Found';
  }, []);

  return (
    <Section>
      <Main>
        <h2>404 - Page Not Found</h2>
      </Main>
    </Section>
  );
}

export default NotFound;
