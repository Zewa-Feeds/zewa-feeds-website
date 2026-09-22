/**
 * A snapshot of real reviews, for when the API cannot be reached.
 *
 * These are GENUINE Amazon reviews, copied from the database — the same rows
 * `/reviews/featured` serves. They are here so a transient API failure degrades
 * to slightly stale truth rather than deleting the whole section from the home
 * page, which is what happened when the fetch simply returned null.
 *
 * NOT a licence to invent. Every field below traces to a real review; the file
 * exists because a review that was true last week is still true today. The live
 * endpoint is always preferred, and the section credits Amazon either way.
 *
 * Regenerate from the database when the reviews change materially.
 */
export const FALLBACK_REVIEWS = [
    {
      "author": "Raj",
      "rating": 5,
      "title": "My flowerhorn is absolutely loving this!",
      "body": "I have an 8 inch FH and he was used to some of best imported feeds since a child. Thought he wouldn't take natural food but he is now all over it. Visible difference in activity and colours. But he took a bit of time to adjust though, around 3-4 days had to give in parallel with other foods. But now he is not touching any old foods.",
      "product": "Zewa Feeds Monster Sticks A10",
      "source": "Amazon"
    },
    {
      "author": "Raj",
      "rating": 5,
      "title": "Ideal food for premium cherry red ornamental shrimps",
      "body": "This is ideal for premium cherry red, blue and yellow ornamental shrimps. They are eating it like crazy and growth is great so far with my small ones.",
      "product": "Zewa Feeds Shrimp Grazers S5",
      "source": "Amazon"
    },
    {
      "author": "Raj",
      "rating": 5,
      "title": "Best pleco food available in India",
      "body": "One of the best pleco foods available in India. I have been using imported feeds only for my L-series and had switched to Zewa feeds a year ago with their 45g bottles. now 500g is available and I am happy. Easy to maintain as there is no water contamination even after 30minutes. clean packing, ideal size for small to medium Places to graze on.",
      "product": "Zewa Feeds Pleco Bites P5",
      "source": "Amazon"
    },
    {
      "author": "Sunil Kumar",
      "rating": 5,
      "title": "Budget friendly",
      "body": "Budget friendly, compared to others in the market, and my pleco loved eating them.",
      "product": "Zewa Feeds Pleco Bites P5",
      "source": "Amazon"
    },
    {
      "author": "Darren sohkhlet",
      "rating": 5,
      "title": "I would advise this to be administered to fish that are herbivorous algae eaters only",
      "body": "The food is solely for herbivorous fish such as plecos and algae eaters. My experience with this product is really great as i have 2 plecos in my tank. They have grown healthily and have been active since i started feeding them this. It does sink to the bottom on contact with the water. Its a pretty nifty product imo.",
      "product": "Zewa Feeds Pleco Bites P5",
      "source": "Amazon"
    },
    {
      "author": "Kshyanaprava Mishra",
      "rating": 5,
      "title": "Bon Appetite-Affordable",
      "body": "A must have delicacy for bottom dwellers. My Red cherry shrimps are taking it on alternative days and gobbling the whole thing. The size of the pellets are same as conventional pellets and they sink to the bottom immediately, still the quantity could increase. The packaging of the pellets is also great.",
      "product": "Zewa Feeds Pleco Bites P5",
      "source": "Amazon"
    },
    {
      "author": "Deepak",
      "rating": 5,
      "title": "Good quality",
      "body": "Good quality micro pellets. Fish are eating well and growing.",
      "product": "Zewa Feeds Micro Pellets M3",
      "source": "Amazon"
    },
    {
      "author": "Aqua Hobbyist",
      "rating": 5,
      "title": "Perfect for nano fish",
      "body": "Best micro pellets I've found in India. My chili rasboras and ember tetras love them. No water pollution.",
      "product": "Zewa Feeds Micro Pellets M3",
      "source": "Amazon"
    },
    {
      "author": "Surabhi Tiwari",
      "rating": 5,
      "title": "I highly recommend this food for all types of small fish!",
      "body": "I've been using Zewa Feeds for my guppies, tetras, and other small tropical fish, and I'm impressed. The micro pellets are tiny and float well, perfect for top and mid-level feeders. Within a few days, I noticed my fish were more active and their colors looked brighter. There's no clouding in the tank, and even picky eaters seem to enjoy it. At this price point, it's great value!",
      "product": "Zewa Feeds Micro Pellets M3",
      "source": "Amazon"
    },
    {
      "author": "King Arthur",
      "rating": 5,
      "title": "It is good food. I tried and I got fins",
      "body": "Crush and give it to fry. For adult small fishes like guppy, rasbora, tetra and Apistogramma of small size, it is too small. While you pinch and throw in tank, half of it goes waste with air. Try to put in a small bottle cap and then put it in aquarium water at one place. For small fry, crush it and feed them. That is the best.",
      "product": "Zewa Feeds Micro Pellets M3",
      "source": "Amazon"
    },
    {
      "author": "Vidushi.R",
      "rating": 5,
      "title": "Go for it been using it for a year now!",
      "body": "My fishes love it so much I'm on my second batch of this food I've been using it for a year and all my fishes are healthy also it's only for smaller fish that's why the pellets are small because they can't eat bigger betta pellets are so but anyway it's really good",
      "product": "Zewa Feeds Micro Pellets M3",
      "source": "Amazon"
    },
    {
      "author": "Deroots",
      "rating": 5,
      "title": "Less water pollution",
      "body": "Love to see the Koi feed from zewa list on amazon.Have been using the feed for last 6 months and the results are amazing.Water pollution is much less and the feed is water stable and Koi's love the feed",
      "product": "Zewa Feeds Koi Bites K7",
      "source": "Amazon"
    }
  ];

/** The range-wide figure at the time of the snapshot. */
export const FALLBACK_RATING = { average: 4.5, count: 469 };
