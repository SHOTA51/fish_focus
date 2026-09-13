import React, { useState } from "react";
import { Pressable, SafeAreaView, Text, TextInput, View } from "react-native";
import { router } from "expo-router";

const menuItems = [
  { label: "Profile", icon: "◯" },
  { label: "Quest", icon: "◍" },
  { label: "Notification", icon: "◔" },
  { label: "Setting", icon: "⚙" },
  { label: "Statistics", icon: "▤" },
];

export default function SettingsScreen() {
  const [selected, setSelected] = useState("Setting");

  return (
    <SafeAreaView className="flex-1 bg-[#f2f1ee]">
      <View className="flex-1 flex-row">
        <View className="w-[42%] bg-[#f5f4f2] px-4 pt-3">
          <View className="mb-3 flex-row items-center justify-between px-1">
            <View className="flex-row items-center">
              <Text className="text-xl font-black tracking-tight text-[#1d1d1d]">5G</Text>
            </View>
            <View className="h-5 w-10 items-end justify-center rounded-full border border-[#1d1d1d] px-1">
              <View className="h-3 w-5 rounded-full bg-[#1d1d1d]/80" />
            </View>
          </View>

          <View className="mt-4">
            {menuItems.map((item) => {
              const active = item.label === selected;

              return (
                <Pressable
                  key={item.label}
                  onPress={() => {
                    setSelected(item.label);
                    if (item.label === "Profile") router.push("/profile");
                    if (item.label === "Statistics") router.push("/statistics");
                  }}
                  className={`flex-row items-center border-b border-[#1f1f1f]/30 py-4 ${
                    active ? "bg-[#dfe0dd]" : "bg-transparent"
                  }`}
                >
                  <Text className="ml-2 mr-4 text-[30px] font-medium text-[#1c1c1c]">
                    {item.icon}
                  </Text>
                  <Text className="text-[20px] font-medium text-[#1c1c1c]">
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="flex-1 bg-[#b9b8b5] px-4 pb-4 pt-5">
          <View className="mb-6 flex-row justify-end">
            <Pressable
              onPress={() => router.back()}
              className="h-12 w-12 items-center justify-center rounded-xl bg-[#dedcd8]"
            >
              <Text className="text-3xl font-black text-[#1b1b1b]">←</Text>
            </Pressable>
          </View>

          <View className="mt-10 items-center justify-center">
            <Text className="mb-3 text-[22px] font-medium text-[#1b1b1b]">one!</Text>

            <View className="relative h-44 w-[210px] items-center justify-center">
              <View className="absolute bottom-0 h-24 w-[170px] rounded-[80px] border-[3px] border-[#1b1b1b] bg-transparent" />
              <View className="absolute bottom-[24px] left-[20px] h-10 w-[130px] rounded-[50px] border-[3px] border-[#1b1b1b] bg-transparent" />
              <View className="absolute bottom-[58px] left-[52px] h-7 w-[58px] rounded-full border-[3px] border-[#1b1b1b] bg-transparent" />
              <View className="absolute bottom-[54px] left-[86px] h-2 w-2 rounded-full bg-[#1b1b1b]" />
              <View className="absolute bottom-[52px] left-[70px] h-3 w-5 rounded-full border-[2px] border-[#1b1b1b] bg-transparent" />
              <View className="absolute bottom-[36px] left-[72px] h-2 w-2 rounded-full bg-[#1b1b1b]" />
              <View className="absolute bottom-[36px] left-[102px] h-2 w-2 rounded-full bg-[#1b1b1b]" />
              <View className="absolute bottom-[60px] left-[118px] h-4 w-5 rounded-full border-[2px] border-[#1b1b1b] bg-transparent" />
            </View>

            <View className="mt-5 w-[180px] rounded-md border border-[#1b1b1b]/30 bg-[#d8d7d4] px-3 py-2">
              <TextInput
                value="ne"
                editable={false}
                className="text-lg text-[#1b1b1b]"
                placeholder="ne"
                placeholderTextColor="#4b4b4b"
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
