import { Badge, Box, Divider, Flex, HStack, Heading, IconButton, Tooltip, Icon, Text, Progress } from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { strfdelta } from "../utils";
import NetworkInfo from "./Network";
import { TbArrowRight, TbReload } from "react-icons/tb";

const COLOR_FOR = {
    good: 'green',
    bad: 'red'
}

const LinkDescItem = ({title, desc, value}) => {
    return (
        <Flex fontSize="sm">
            <Flex flex="1" justifyContent="right">
            <Tooltip label={desc || ""}>{title}</Tooltip>
            &nbsp;&bull;&nbsp;
            </Flex>
            <Flex flex="1">
             {value}
            </Flex>
        </Flex>
    )
}

const Link = ({url, link}) => {
    const queryClient = useQueryClient();
    const queryKey = ["link", link.src, link.dst];
    const statusQuery = useQuery(queryKey, async () => {
        const res = await fetch(url+"/links/"+link["src"]+"/"+link["dst"]);
        return await res.json();
    }, {
        staleTime: 10000,
        cacheTime: 5000,
        refetchInterval: 10000,
    });

    if (!statusQuery.isFetched) {
        return <Box p="2" className="link-info">
            <Flex className="link-header">
                <Heading size="sm">Loading</Heading>
            </Flex>
        </Box>
    }

    const status = statusQuery.data;
    const updateStatus = (event: Event) => {
        queryClient.invalidateQueries(queryKey);
    }

    return (
        <Box p="2" className="link-info">
        <Flex className="link-header" mb="0.2em">
            <HStack flex="1" overflowX="hidden" mr="10px">
            <NetworkInfo url={url} id={status.src} name={status.src_name} />
            <Icon as={TbArrowRight} />
            <NetworkInfo url={url} id={status.dst} name={status.dst_name} />
            </HStack>
            {status.tx_seq > status.rx_seq && <HStack className="delivering" mr="6px">
                <Text>Delivering</Text>
                <Progress
                    value={status.pending_delay} max={status.time_limit}
                    size="md" width="100px"
                    hasStripe isAnimated
                    isIndeterminate={status.pending_delay >= status.time_limit}
                    colorScheme="red" />
            </HStack>}
            <IconButton size="xs" onClick={updateStatus} isLoading={statusQuery.isLoading} icon={<Icon as={TbReload} />} />
        </Flex>
        <Divider />
        <Flex className="link-description">
        <LinkDescItem title="TX Sequence" value={status.tx_seq} />
        <LinkDescItem title="RX Sequence" value={status.rx_seq} />
        <LinkDescItem title="TX Height" desc='Last block height of source blockchain' value={status.tx_height} />
        <LinkDescItem title="RX Height" desc='Last block height of BMV in target blockchain' value={status.rx_height} />
        <LinkDescItem title="Pending Count" desc='Pending message count' value={status.pending_count} />
        <LinkDescItem title="Pending Delay" desc='Delay after first pending message' value={strfdelta(status.pending_delay)} />
        </Flex>
        <Divider />
        <Flex className="network-state">
        <Badge flex="1" textAlign="center" fontSize="lg" colorScheme={COLOR_FOR[status.state]}>{String(status.state).toUpperCase()}</Badge>
        </Flex>
        </Box>
    );
}

export default Link;