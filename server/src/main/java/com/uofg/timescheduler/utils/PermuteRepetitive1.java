package com.uofg.timescheduler.utils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class PermuteRepetitive1 {

    List<List<Integer>> list;

    public List<List<Integer>> permuteRepetitive(int[] nums) {
        list = new ArrayList<List<Integer>>();
        List<Integer> team = new ArrayList<Integer>();
        boolean jud[] = new boolean[nums.length];
        Arrays.sort(nums);
        dfs(jud, nums, team, 0);
        return list;
    }

    private void dfs(boolean[] jud, int[] nums, List<Integer> team, int index) {
        // TODO Auto-generated method stub
        int len = nums.length;
        if (index == len)// 停止
        {
            list.add(new ArrayList<Integer>(team));
        } else {
            for (int i = 0; i < len; i++) {
                if (jud[i] || (i > 0 && nums[i] == nums[i - 1] && !jud[i - 1])) //当前数字被用过 或者前一个相等的还没用，当前即不可用
                {
                    continue;
                }
                team.add(nums[i]);
                jud[i] = true;
                dfs(jud, nums, team, index + 1);
                jud[i] = false;// 还原
                team.remove(index);
            }
        }
    }
}
