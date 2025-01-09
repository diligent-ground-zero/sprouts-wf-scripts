
import gsap from 'gsap'

export default function() {
  return new CreatorSingleScripts();
}

class CreatorSingleScripts {
  constructor(){
    this.creatorVideoCars()
  }

  creatorVideoCars() {
    console.log('creatorVideoCars')
    // gsap.utils.toArray(".feed_grid_item").forEach(function(item) {
    //     gsap.to(item, {
    //       y: () => item.offsetHeight + 5,
    //       ease: "none",
    //       scrollTrigger: {
    //         start: "top 50%",
    //         trigger: '.feed_grid',
    //         scrub: true,
    //         pin: false,
    //         markers: true,
    //         invalidateOnRefresh: true
    //       },
    //     }); 
    // });
  }


}