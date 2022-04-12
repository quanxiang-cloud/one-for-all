jest.mock('../format');
import toAST from '../to-ast';

const someBadSCSS = `
// some unformatted scss
.parent
  color: red;

  @include someMixin;

      .children { font-size: 20px; }
}
`;

test('toAST_should_throw_if_encounter_bad_scss', (done) => {
  toAST(someBadSCSS).catch((err) => {
    done();
  });
});
