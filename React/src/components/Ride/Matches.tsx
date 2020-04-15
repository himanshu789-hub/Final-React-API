import * as React from "react";
import OfferCard from "../OfferCard/OfferCard";
import { Book } from "../../Models/Booking";
import { Offer } from "../../Models/Offerring";

interface IMatches {
  offers: Array<any>;
  book: Book;
}
function Matches(props: IMatches) {
  let { offers, book } = props;
  if (offers == null && book == null)
    return <></>;
  
  else {
    debugger;
    const offersRender = offers.map((e, index) => {
      return (
        <OfferCard bookRequest={book}
          isOnUpdate={false}
          key={(index + 1) + ""}
          offer={e}
        ></OfferCard>
      );
    });
    return (
      <div id="matches">
        <div id="matchesLabel">Your Matches</div>
        <div id="allmatches">{offersRender}</div>
      </div>
    );
  
  }
}

export default Matches;
