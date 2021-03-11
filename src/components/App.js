import Blocktext from './Blocktext'
import { v4 as uuidv4 } from 'uuid';

function App() {

  const messages = ['Time to','drink', 'champagne', 'and dance', 'on the', 'table']
  
  return (
      <div className="textbox-wrapper">
        <div className="textbox" id="textbox">
        { messages.map(msg => {
            return <Blocktext text={msg} key={ uuidv4() } />
        })}
        </div>
      </div>
  );
}

export default App;
