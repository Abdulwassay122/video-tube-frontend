"use client";
import { useEffect, useState } from "react";

import { Box, Grid } from "@mui/material";
import { apiRequest } from "@/utils/apiRequest";
import { useRouter } from "next/navigation";
import VideoCard from "./VideoCard";

export default function page() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>();
  const [error, setError] = useState<string>("");

  const router = useRouter();

  const fetchApi = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiRequest(
        "GET",
        `${apiUrl}/api/v1/videos`,
        {},
        router
      );
      setData(response);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {" "}
      {/* <div className="">Lorem ipsum dolor, sit amet consectetur adipisicing elit. At repellat libero mollitia cupiditate, porro reiciendis! Nobis, repellendus officia facilis voluptates culpa et sint porro, voluptas dolore temporibus labore est sapiente?Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus quis nisi consequatur sed at! Ea aliquid soluta quod cum alias, qui provident quidem autem eaque sunt, ullam facere voluptatibus aut suscipit labore obcaecati distinctio, ipsa inventore ipsam quos quo voluptate. Necessitatibus voluptatem soluta ducimus asperiores, distinctio voluptas sint repudiandae, molestias quos magnam eius dicta maxime natus quisquam ratione aspernatur saepe odio nesciunt at tenetur. Quod iste minus eum animi illum molestiae facilis, nam nihil, nostrum ipsum magni? Laborum vero inventore impedit minus iste ea consequuntur sapiente omnis adipisci? Perferendis recusandae aut excepturi ab numquam. Minus aspernatur voluptate explicabo necessitatibus eos delectus temporibus accusantium obcaecati impedit, repellat doloribus, mollitia aut, quo voluptatibus odit magnam ex sequi quaerat ea dolor. Perferendis inventore ab magnam adipisci iure soluta necessitatibus voluptatum nostrum. Perspiciatis, maiores voluptatibus? Eligendi, facilis! Alias culpa quos, est explicabo eos eveniet qui, ipsam facere quod commodi dolorum optio, totam illum temporibus sequi dolor natus quidem molestiae! Sapiente corrupti minima laborum eveniet deserunt repudiandae, in iste similique debitis cum omnis necessitatibus unde accusantium reprehenderit recusandae enim voluptatum porro quidem velit repellendus beatae consequatur. Repellat veniam tempora adipisci quas, deleniti velit cumque porro architecto saepe iusto sequi quaerat odio odit exercitationem laudantium corporis excepturi facere voluptatem amet rem molestiae ipsa perferendis quos debitis. In dolores voluptate officiis tenetur, magni fuga sint facere quidem fugit repellat accusantium sunt exercitationem eum quis quae qui officia architecto obcaecati. Tempora inventore est nemo hic? Cupiditate, temporibus! Atque totam vel architecto cumque quis, suscipit iure quos sapiente dolores veniam unde! Ea, eum! Iste vero dicta molestiae aperiam? Doloribus eum illum eius magnam voluptatem explicabo culpa quibusdam laborum laudantium dolor, quo quaerat voluptas mollitia sint perferendis minus fugit animi? Facere debitis sapiente facilis vero quas. Dolorum vitae error doloribus ratione sapiente beatae, necessitatibus explicabo. Ex autem distinctio accusamus dolore praesentium velit natus ipsam, eveniet voluptatum debitis, voluptatibus tenetur eum eaque optio. Impedit mollitia facilis ea optio incidunt quaerat debitis maiores, eaque ab omnis unde, consequatur modi, nisi rerum sint consectetur eius quam molestiae voluptas fuga labore. Laudantium placeat harum id at magnam! Itaque quo atque et tenetur doloribus quis nisi iure ipsa quae numquam deleniti necessitatibus, odio pariatur, provident maxime. Nulla molestias, non recusandae reiciendis accusamus libero impedit delectus fugiat nemo aliquid numquam facilis minima sapiente. Obcaecati veniam aliquam hic consequatur magni deserunt facilis beatae nemo ullam et neque, voluptate incidunt, necessitatibus, corrupti atque eveniet itaque illum odit unde. Praesentium dolorum, deleniti molestias dignissimos ea modi. Ea veritatis aspernatur non architecto neque reiciendis, voluptatum dicta soluta possimus officia laboriosam corrupti, voluptatem eos dolor rem nesciunt maxime suscipit consequuntur ipsum repudiandae, incidunt vitae ipsam? Magnam laboriosam, alias libero distinctio molestias eius laudantium amet illum dolores veniam quisquam voluptas neque in enim ab voluptatem veritatis dolore nobis? Quidem nostrum enim laboriosam id iure repudiandae, culpa nobis sint velit unde reiciendis molestiae dicta nam deserunt aliquid quis ipsam obcaecati voluptatum non? Placeat expedita commodi accusamus, ullam quisquam aliquam nostrum accusantium non nisi quo corporis odio voluptates recusandae architecto quod asperiores, ipsa obcaecati perspiciatis, rem ipsum atque. Aliquam repellat culpa porro perferendis eaque, cum aliquid omnis facere? Fugit illum ex cumque sunt corporis minima aspernatur nemo nihil molestiae quae minus accusamus ratione vel eaque quisquam, expedita dolorum nisi soluta fugiat quaerat possimus. Vero pariatur earum ex modi nesciunt distinctio eum, quos, maiores, deserunt eius omnis iure ab exercitationem consectetur ipsam reiciendis aliquam? Vel doloribus maxime blanditiis natus perspiciatis in numquam consequuntur quidem voluptatibus id debitis corporis libero a omnis voluptates, doloremque, fugiat cumque repellendus vitae? Sequi eaque, quo rem placeat excepturi natus ipsum libero ab error amet adipisci velit dolores in, sapiente commodi praesentium tenetur labore maxime architecto. Consequatur doloribus libero asperiores explicabo fugiat, quisquam delectus tenetur illum corrupti velit esse placeat dolorem in debitis culpa eum, voluptates eveniet quam ad accusamus doloremque est nobis quasi? Facere illo nulla, hic rem nam perspiciatis dolorem fugiat! Suscipit ipsa qui quam voluptas dolore nihil error magni quia deleniti obcaecati, possimus tenetur quidem natus? Quod dignissimos sunt nemo magnam. Doloremque placeat praesentium, illo maxime suscipit deleniti, autem nesciunt sunt ipsam perspiciatis culpa dolorem tenetur ad, et recusandae voluptate aliquid ex saepe ipsum. Molestiae aliquid repellat in vel tempore, deserunt vero quod harum illum vitae laborum cum alias, blanditiis perferendis dolorum animi consequatur? Mollitia eos voluptas nisi fugit consequuntur facere distinctio beatae quam fuga facilis enim minus explicabo vel, molestiae, exercitationem libero ducimus aperiam placeat ipsum. Ut autem quisquam molestiae ipsum harum magnam alias doloribus dignissimos rerum, omnis, in earum rem temporibus beatae et. Quod ratione blanditiis, beatae quidem maiores aperiam perferendis fuga, magni excepturi doloribus tempora modi ipsam quibusdam ut officiis. Quod quo vitae provident sunt explicabo voluptas, ipsum dolores eos praesentium perferendis aliquam deleniti officiis ex ut aliquid. Tempora error placeat quia adipisci voluptates rerum aliquam corrupti ea quos, facilis ex at qui maxime harum totam dignissimos! Itaque libero eos veniam, eveniet accusamus doloribus voluptatem id autem amet. Officia vero est optio, et ipsa aspernatur inventore dolorum porro, eaque vel, pariatur dolorem deleniti officiis qui ratione quae rerum modi repellendus sit ipsam hic! Quos unde perferendis minima accusantium temporibus velit vel, suscipit molestiae nemo incidunt nulla quisquam obcaecati laudantium nobis debitis, sunt a, illo voluptatum iste! Repellendus nemo deserunt sapiente officia reprehenderit eius, excepturi voluptatibus qui, nulla expedita debitis fuga at assumenda ratione ut! Quia excepturi vitae perferendis ratione debitis doloribus a, ducimus itaque at sit earum consequuntur in rem sapiente consectetur commodi beatae deleniti veniam aspernatur sequi fugiat aliquam rerum. Dolore quos fuga eligendi facilis labore. Placeat eaque consectetur voluptas rem aperiam iste laudantium, consequatur magnam nobis modi error voluptatibus officia minus nihil omnis obcaecati odio tempore nulla quia dolorum cumque doloribus! Perspiciatis incidunt possimus earum placeat dolor corporis voluptates qui facere, omnis, corrupti sint fugiat neque laudantium exercitationem suscipit dicta molestiae? Possimus dolorum ipsum adipisci ipsam, eveniet odit vitae quos sint quibusdam laborum cum consequuntur, corrupti fuga pariatur accusantium impedit sequi deleniti laudantium officiis ut modi officia aliquid a dolores! Quibusdam dolorem unde placeat autem, est, repudiandae reiciendis ullam quae non fugit numquam!</div> */}
      <Box>
        <Grid container spacing={2}>
          {data?.data.videos.map((item: any, i: number) => (
            <Grid size={{ md: 4, sm: 6, xs: 12 }} key={i}>
              <VideoCard
                id={item._id}
                thumbnail={item.thumbnail}
                avatar={item.owner.avatar}
                fullName={item.owner.fullName}
                views={item.views}
                createdAt={item.createdAt}
                title={item.title}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
