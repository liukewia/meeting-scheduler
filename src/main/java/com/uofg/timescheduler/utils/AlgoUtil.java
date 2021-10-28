package com.uofg.timescheduler.utils;

import com.uofg.timescheduler.service.internal.TimeRange;
import java.util.ArrayList;
import java.util.List;

public class AlgoUtil {

    public static void main(String[] args) {
        System.out.println(getSubsetCombination(5, 0));
    }

    public static List<List<Integer>> getSubsetCombination(int n, int k) {
        List<List<Integer>> valueList = new ArrayList<List<Integer>>();//结果
        int[] num = new int[n];//数组存储1-n
        boolean[] jud = new boolean[n];//用于判断是否使用
        for (int i = 0; i < n; i++) {
            num[i] = i + 1;
        }

//        List<Integer> team = new ArrayList<Integer>();
        combine_dfs(-1, k, valueList, jud, n);
        return valueList;
    }

    private static void combine_dfs(int index, int count, List<List<Integer>> valueList, boolean[] jud,
            int n) {
        if (count == 0) //k个元素满
        {
            List<Integer> list = new ArrayList<Integer>();
            for (int i = 0; i < n; i++) {
                if (jud[i]) {
                    list.add(i + 1);
                }
            }
            valueList.add(list);
        } else {
            for (int i = index + 1; i < n; i++)//只能在index后遍历 回溯向下
            {
                jud[i] = true;
                combine_dfs(i, count - 1, valueList, jud, n);
                jud[i] = false;//还原

            }
        }
    }

    /**
     * time complexity: O(A.length + B.length)
     * space complexity: O(A.length + B.length)
     *
     * @param A
     * @param B
     * @return
     */
    public static List<TimeRange> intervalIntersection(List<TimeRange> A, List<TimeRange> B) {
        List<TimeRange> ans = new ArrayList<>();
        int i = 0, j = 0;

        while (i < A.size() && j < B.size()) {
            // Let's check if A[i] intersects B[j].
            // lo - the startpoint of the intersection
            // hi - the endpoint of the intersection
            long lo = Math.max(A.get(i).getStartTime(), B.get(j).getStartTime());
            long hi = Math.min(A.get(i).getEndTime(), B.get(j).getEndTime());
            if (lo < hi) {
                ans.add(new TimeRange(lo, hi));
            }

            // Remove the interval with the smallest endpoint
            if (A.get(i).getEndTime() < B.get(j).getEndTime()) {
                i++;
            } else {
                j++;
            }
        }

        return ans;
    }
}
