import { useQuery } from "@tanstack/react-query";
import { UserService } from "../../../api/services/userService";

export const useUser = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: UserService.get,
        staleTime: 5 * 60 * 1000
    })
}