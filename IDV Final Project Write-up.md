# IDV - Final Project

## Motivation

n 2015, as the refugee crisis in Europe reached its peak, the word “migrant” started to take precedence over the many other terms applied to people on the move. However, the term only applied to certain kinds of human beings. The professional who moves to a neighbouring city for work is not usually described as a migrant, and neither is the wealthy businessman who acquires new passports as easily as he moves his money around the world. The terms that surround migration are inextricably bound up with power, as is the way in which our media organisations choose to disseminate them.

Migration to Europe is extremely varied. It includes people arriving through regular channels as student programmes and professional recruitment. It occurs as the result of the accession of eastern neighbourhood countries to the European Union (EU). It also includes displaced people arriving as the result of war or other types of persecution: especially from Syria, but also from Afghanistan, Eritrea and Libya. While relatively small in number compared to other populations, Africans have featured predominantly in popular representation. Descriptions of Europe being ‘invaded’ or ‘swarmed’ by African migrants are commonplace in the media.

Some observers point to an underlying racism informing these narratives. While representing a smaller proportion of total arriving migrants than other populations, African migrants often receive a disproportionate amount of attention and reaction - both in relation to debate about migration in host countries, and these in turn have come to influence international policy and programming. The media amplifications of Africa-Europe migration flow creates and perpetuates the illusive notions that Europe is inundated by African migrants.

An analysis of the data extracted from the United Nations Department of Economic and Social Affairs (UNDESA) - “International Migrant Stock, 2019” - elucidates the flow of migrants to Europe from other geographic regions with that from Africa, with many more Africans migrating within the continent than outside of it.

## Approach to the Visualisation

As this is a story on migration between different countries, I decided to use a connection map to visualise the movement between different geographic regions to Europe. The function d3.geoPath() and “great circle” were used to draw the links between the locations.

Initially, I drew links between all countries of origin to all countries of destination in Europe as specified in the data but that resulted in a very crowded connection map. I then decided to group the countries into their geographic sub-regions which resulted in a cleaner looking map.

I decided to use 3 different colours for the streamlets to highlight migration from Africa to Europe, migration from other regions outside of Africa to Europe, and migration within Africa itself. Line charts corresponding to the data were also included to allow for visual comparison of the magnitude of migrations among these 3 categories.

The animation starts automatically when the page loads. Including a “play” button allows for users to replay the animation whenever they choose to. Users can also hover over the streamlets or legend to focus on a particular region.

## Challenges

One of the biggest challenges was figuring out the animations. I turned to using a new library, GSAP from GreenSock, for the animations. This, and going through the various modules in d3.js, both took a fair bit of trial and error.

Should time permits, I would have liked to include markers of which their sizes are proportional to the number of immigrants from a particular region on the map. I would also have liked to include a feature whereby users can zoom in on a particular region which will then highlight the number of migrants from that particular country.


