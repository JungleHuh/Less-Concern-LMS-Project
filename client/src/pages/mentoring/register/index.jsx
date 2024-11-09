import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { registerMentorService } from "@/services/mentor";
import { EXAM_CONFIG } from "@/config/board";
import { Label } from "@/components/ui/label";

export default function MentorRegisterPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);

  const form = useForm({
    defaultValues: {
      name: "",
      examType: "",  // 빈 문자열로 초기화
      experience: "",
      introduction: "",
      mentoringInfo: {
        price: "50000",
        duration: "60",
      },
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB 제한
        toast({
          variant: "destructive",
          title: "오류",
          description: "이미지 크기는 5MB를 초과할 수 없습니다."
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      // FormData 생성
      const formData = new FormData();
      
      // 기본 데이터 추가
      Object.keys(data).forEach(key => {
        if (key === 'mentoringInfo') {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      });
      
      // 이미지 파일 추가
      const imageFile = document.querySelector('input[type="file"]').files[0];
      if (imageFile) {
        formData.append('profileImage', imageFile);
      }

      const response = await registerMentorService(formData);
  
      if (response.success) {
        toast({
          title: "등록 완료",
          description: `${EXAM_CONFIG[data.examType].name} 멘토 등록이 완료되었습니다. 승인 후 활성화됩니다.`
        });
        navigate(`/mentoring/${data.examType}`);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "오류",
        description: error.message || "멘토 등록에 실패했습니다. 다시 시도해주세요."
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>멘토 등록</CardTitle>
          <CardDescription>
            멘토링을 위한 기본 정보를 입력해주세요.
          </CardDescription>
        </CardHeader>



        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="space-y-4">
              {/* 프로필 이미지 업로드 섹션 */}
              <div className="space-y-4">
                <Label htmlFor="profileImage">프로필 이미지</Label>
                <div className="flex items-center gap-4">
                  <div className="relative w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <p className="text-sm">이미지를</p>
                        <p className="text-sm">업로드하세요</p>
                      </div>
                    )}
                    <input
                      type="file"
                      id="profileImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>권장 이미지 크기: 300x300</p>
                    <p>최대 파일 크기: 5MB</p>
                    <p>지원 형식: JPG, PNG</p>
                  </div>
                </div>
              </div>

              
              <FormField
  control={form.control}
  name="examType"
  rules={{ 
    required: "시험 유형을 선택해주세요",
    validate: value => value !== "" || "시험 유형을 선택해주세요" 
  }}
  render={({ field }) => (
    <FormItem>
      <FormLabel>시험 유형</FormLabel>
      <Select 
        onValueChange={field.onChange} 
        defaultValue={field.value}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="시험 유형을 선택해주세요" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {Object.entries(EXAM_CONFIG).map(([key, config]) => (
            <SelectItem key={key} value={key}>
              {config.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage /> {/* 에러 메시지 표시 */}
    </FormItem>
  )}
/>
                      
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "이름/닉네임을 입력해주세요" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름/닉네임</FormLabel>
                    <FormControl>
                      <Input placeholder="멘토링에서 사용할 이름을 입력해주세요" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                rules={{ required: "경력 및 자격을 입력해주세요" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>경력 및 자격</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="예: 2022년 합격, 현직 3년차" 
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="introduction"
                rules={{ required: "멘토링 소개를 입력해주세요" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>멘토링 소개</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="시험 준비에 대한 경험과 노하우를 공유해주세요."
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="mentoringInfo.price"
                  rules={{ 
                    required: "가격을 입력해주세요",
                    min: {
                      value: 30000,
                      message: "최소 30,000원부터 설정 가능합니다"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>시간당 가격 (원)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="30000"
                          step="10000"
                          {...field} 
                        />
                      </FormControl>
                      <p className="text-sm text-muted-foreground">
                        최소 30,000원부터 설정 가능
                      </p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mentoringInfo.duration"
                  rules={{ 
                    required: "시간을 선택해주세요",
                    min: {
                      value: 30,
                      message: "최소 30분부터 설정 가능합니다"
                    },
                    max: {
                      value: 120,
                      message: "최대 120분까지 설정 가능합니다"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>기본 시간 (분)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="30"
                          min="30"
                          max="120"
                          {...field} 
                        />
                      </FormControl>
                      <p className="text-sm text-muted-foreground">
                        30분 ~ 120분 사이 설정
                      </p>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                취소
              </Button>
              <Button type="submit">멘토 등록하기</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}