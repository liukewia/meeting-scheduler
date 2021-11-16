package com.uofg.timescheduler.util;

import java.util.ArrayList;
import java.util.List;

public class permuteUnique {

    List<List<Integer>> list;

    public static void solve(int[][] step) {
        int M = step.length;
        int N = step[0].length;
        int[][] dp = new int[M + 1][N + 1];
        for (int i = 1; i < M + 1; i++) {
            for (int j = 1; j < N + 1; j++) {
                dp[i][j] = Integer.MAX_VALUE / 2;
            }
        }
        dp[1][1] = 0;
        for (int i = 1; i < M + 1; i++) {
            for (int j = 1; j < N + 1; j++) {
                if (step[i - 1][j - 1] == 0) {
                    continue;
                } else {
                    for (int k = 1; k <= step[i - 1][j - 1]; k++) {
                        if (j + k <= N && step[i - 1][j + k - 1] != 0) {
                            dp[i][j + k] = Math.min(dp[i][j + k], dp[i][j] + 1);
                        }
                        if (i + k <= M && step[i + k - 1][j - 1] != 0) {
                            dp[i + k][j] = Math.min(dp[i + k][j], dp[i][j] + 1);
                        }
                    }
                }
            }
        }
        System.out.println(dp[M][N] == Integer.MAX_VALUE / 2 ? -1 : dp[M][N]);

    }

    public static void main(String[] args) {
        int[][] step = new int[3][3];
        step[0] = new int[]{3, 2, 2};
        step[1] = new int[]{0, 1, 0};
        step[2] = new int[]{1, 1, 1};
        solve(step);
    }

    public List<List<Integer>> _permuteUnique(int[] nums) {
        list = new ArrayList<List<Integer>>();//最终的结果
        List<Integer> team = new ArrayList<Integer>();//回溯过程收集元素
        boolean jud[] = new boolean[nums.length];//用来标记
        dfs(jud, nums, team, 0);
        return list;
    }

    private void dfs(boolean[] jud, int[] nums, List<Integer> team, int index) {
        int len = nums.length;
        if (index == len)// 停止
        {
            list.add(new ArrayList<Integer>(team));
        } else {
            for (int i = 0; i < len; i++) {
                if (jud[i]) //当前数字被用过 当前即不可用
                {
                    continue;
                }
                team.add(nums[i]);
                jud[i] = true;//标记该元素被使用
                dfs(jud, nums, team, index + 1);
                jud[i] = false;// 还原
                team.remove(index);//将结果移除临时集合
            }
        }
    }
}
